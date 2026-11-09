import { Component, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ErrorInfo, MutableRefObject, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  CanvasTexture, Color, DoubleSide, MeshPhysicalMaterial, MeshStandardMaterial, PCFSoftShadowMap,
  PerspectiveCamera, Plane, PMREMGenerator, SRGBColorSpace, Vector3,
} from 'three';
import type { Material as ThreeMaterial, Object3D } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MaterialSample } from './MaterialFinish';
import { DesignScene } from './StudioArtwork';
import { furnishingRole, isPlant, PLANT_POT_COLOR } from './studioModel';
import type { Design, Furnishing, Material, Pattern, Room } from './studioModel';
import { fitItem } from './studioModel';
import { furnitureParts, height3d, isLight, materialPhysics, memoryInteriorCamera, moveOnFloor, position3d } from './studio3dModel';
import type { Finish, Part, Triple } from './studio3dModel';

type Preset = 'Front' | 'Perspective' | 'Overhead';
export interface Cafe3DHandle { exportPng: () => void }
interface Props {
  design: Design;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onMove?: (item: Furnishing) => void;
  onError?: (message: string) => void;
  snap?: boolean;
  grid?: boolean;
  preview?: boolean;
  orbit?: boolean;
  showLights?: boolean;
  handleRef?: MutableRefObject<Cafe3DHandle | null>;
  backdrop?: boolean;
}

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onError?: Props['onError'] }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('The 3D cafe could not be rendered.', error, info);
    this.props.onError?.('3D rendering failed on this device. The illustrated view is available; your saved design has not changed.');
  }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function useFinish(material: Material, color: string, accent: string, pattern: Pattern, opacity: number) {
  const invalidate = useThree((state) => state.invalidate);
  const [error, setError] = useState<string | null>(null);
  const finish = useMemo(() => new MeshPhysicalMaterial({
    color: '#ffffff', ...materialPhysics(material), transparent: opacity < 1 || material === 'Glass',
    opacity, thickness: .08, ior: 1.45, side: DoubleSide,
    sheen: material === 'Velvet' || material === 'Boucle' ? .7 : 0,
    sheenColor: new Color(color), colorWrite: true,
  }), [material, color, opacity]);
  useEffect(() => {
    let active = true;
    let texture: CanvasTexture | undefined;
    const image = new Image();
    const svg = renderToStaticMarkup(<MaterialSample material={material} color={color} accent={accent} pattern={pattern} seamless />)
      .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    image.onload = () => {
      if (!active) return;
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) { setError('Could not create the 3D material texture.'); return; }
      ctx.drawImage(image, 0, 0, 256, 256);
      texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace;
      finish.map = texture; finish.needsUpdate = true; invalidate();
    };
    image.onerror = () => { if (active) setError(`Could not load the ${material} texture.`); };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    return () => { active = false; image.onload = null; image.onerror = null; texture?.dispose(); };
  }, [material, color, accent, pattern, finish, invalidate]);
  useEffect(() => () => finish.dispose(), [finish]);
  if (error) throw new Error(error);
  return finish;
}

type Palette = Record<Exclude<Finish, 'main' | 'accent'>, ThreeMaterial>;
const PaletteContext = createContext<Palette | null>(null);

function Primitive({ part, main, accent }: { part: Part; main: ThreeMaterial; accent: ThreeMaterial }) {
  const palette = useContext(PaletteContext)!;
  const material = part.finish === 'main' ? main : part.finish === 'accent' ? accent : palette[part.finish];
  return <mesh position={part.position} scale={part.size} rotation={part.rotation} material={material} castShadow receiveShadow>
    {part.geometry === 'box' ? <boxGeometry args={[1, 1, 1]} />
      : part.geometry === 'sphere' ? <sphereGeometry args={[.5, 14, 10]} />
        : part.geometry === 'torus' ? <torusGeometry args={[.4, .1, 6, 20]} />
          : <cylinderGeometry args={[.5, .5, 1, 18]} />}
  </mesh>;
}

function TextPanel({ text, color, background, font, position, size, opacity = 1 }: {
  text: string; color: string; background: string; font: string; position: Triple; size: [number, number]; opacity?: number;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = Math.max(128, Math.round(1024 * size[1] / size[0]));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create the cafe signage canvas.');
    ctx.fillStyle = background; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const lines = text.split('\n').slice(0, 7);
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const fontSize = canvas.height * .72 / Math.max(1, lines.length);
    ctx.font = `${fontSize}px ${font}`;
    lines.forEach((line, i) => ctx.fillText(line, canvas.width / 2, canvas.height / 2 + (i - (lines.length - 1) / 2) * fontSize * 1.15, canvas.width * .92));
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace; return map;
  }, [text, color, background, font, size[0], size[1]]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={position}><planeGeometry args={size} /><meshBasicMaterial map={texture} side={DoubleSide} transparent={opacity < 1} opacity={opacity} /></mesh>;
}

function Furniture({ item, design, selected, onPointerDown }: { item: Furnishing; design: Design; selected: boolean; onPointerDown?: (event: ThreeEvent<PointerEvent>) => void }) {
  const sharedPalette = useContext(PaletteContext)!;
  const palette = useMemo<Palette>(() => {
    if (item.opacity === 100) return sharedPalette;
    const fade = (source: ThreeMaterial) => { const result = source.clone(); result.transparent = true; result.opacity *= item.opacity / 100; return result; };
    return { glass: fade(sharedPalette.glass), leaf: fade(sharedPalette.leaf), bulb: fade(sharedPalette.bulb), dark: fade(sharedPalette.dark), paper: fade(sharedPalette.paper), coffee: fade(sharedPalette.coffee), pot: fade(sharedPalette.pot) };
  }, [sharedPalette, item.opacity]);
  useEffect(() => () => { if (palette !== sharedPalette) Object.values(palette).forEach((material) => material.dispose()); }, [palette, sharedPalette]);
  const main = useFinish(item.material, item.color, item.accent, item.pattern, item.opacity / 100);
  const accent = useFinish(item.material, item.accent, item.color, 'Plain', item.opacity / 100);
  const foliage = useMemo(() => new MeshStandardMaterial({ color: item.color, roughness: .85, transparent: item.opacity < 100, opacity: item.opacity / 100 }), [item.color, item.opacity]);
  useEffect(() => () => foliage.dispose(), [foliage]);
  const parts = useMemo(() => furnitureParts(item), [item.kind, item.shape, item.detail]);
  const role = furnishingRole(item.kind);
  return <PaletteContext.Provider value={palette}><group position={position3d(item, design)} rotation={[0, item.rotation * Math.PI / 180, 0]} onPointerDown={onPointerDown} name={`furnishing:${item.id}`}>
    <group scale={[item.width / 100, height3d(item), item.depth / 100]}>
      {parts.map((part, i) => <Primitive key={i} part={part.finish === 'leaf' && isPlant(item.kind) ? { ...part, finish: 'main' } : part} main={isPlant(item.kind) ? foliage : main} accent={accent} />)}
      {['sign', 'menu'].includes(role) && <TextPanel text={item.text} color={role === 'menu' ? item.accent : item.color} background={role === 'menu' ? item.color : item.accent} font={item.font} opacity={item.opacity / 100} position={[0, .52, .11]} size={[.76, .74]} />}
      {selected && <mesh position={[0, .5, 0]} userData={{ editorOnly: true }}><boxGeometry args={[1.06, 1.06, 1.06]} /><meshBasicMaterial color="#d19b35" wireframe transparent opacity={.8} /></mesh>}
    </group>
    {isLight(item) && item.lightPower > 0 && <mesh position={[0, height3d(item) * .75, 0]}><sphereGeometry args={[.05, 8, 8]} /><meshBasicMaterial color={item.lightWarmth > 50 ? '#ffe4a0' : '#d7efff'} transparent={item.opacity < 100} opacity={item.opacity / 100} /></mesh>}
  </group></PaletteContext.Provider>;
}

function RoomShell({ room, grid, interior }: { room: Room; grid: boolean; interior: boolean }) {
  const width = room.width / 100, depth = room.depth / 100;
  const height = 3.2;
  const cornice = .1 + room.wallHeight / 250;
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create the cafe floor texture.');
    ctx.fillStyle = room.floor; ctx.fillRect(0, 0, 512, 512);
    const tile = Math.max(16, room.floorScale / room.width * 512);
    ctx.strokeStyle = room.floorAccent; ctx.fillStyle = room.floorAccent; ctx.lineWidth = 1.5;
    if (room.floorStyle === 'Checkerboard') {
      for (let x = 0, i = 0; x < 512; x += tile, i++) for (let y = 0, j = 0; y < 512; y += tile, j++) if ((i + j) % 2 === 0) ctx.fillRect(x, y, tile, tile);
    } else if (['Tiles', 'Planks', 'Herringbone'].includes(room.floorStyle)) {
      for (let x = -512; x < 1024; x += tile) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + (room.floorStyle === 'Herringbone' ? 512 : 0), 512); ctx.stroke();
        for (let y = 0; y < 512; y += room.floorStyle === 'Planks' ? tile * 3 : tile) ctx.strokeRect(x, y, tile, room.floorStyle === 'Planks' ? tile * 3 : tile);
      }
    } else if (room.floorStyle === 'Terrazzo') {
      for (let i = 0; i < 250; i++) { ctx.beginPath(); const x = i * 137 % 512, y = i * 79 % 512; ctx.moveTo(x, y); ctx.lineTo(x + 5, y + 2); ctx.lineTo(x + 3, y + 7); ctx.fill(); }
    }
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace; return map;
  }, [room.floor, room.floorAccent, room.floorStyle, room.floorScale, room.width]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <group>
    <mesh position={[0, -.07, 0]} receiveShadow><boxGeometry args={[width + .12, .14, depth + .12]} /><meshStandardMaterial color={room.floor} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .002, 0]} receiveShadow><planeGeometry args={[width, depth]} /><meshStandardMaterial map={texture} roughness={.65} /></mesh>
    <mesh position={[0, height / 2, -depth / 2 - .06]} receiveShadow><boxGeometry args={[width + .2, height, .12]} /><meshStandardMaterial color={room.wall} /></mesh>
    <mesh position={[-width / 2 - .06, height / 2, 0]} receiveShadow><boxGeometry args={[.12, height, depth]} /><meshStandardMaterial color={room.wall} /></mesh>
    {interior && <>
      <mesh position={[width / 2 + .06, height / 2, 0]} receiveShadow><boxGeometry args={[.12, height, depth]} /><meshStandardMaterial color={room.wall} /></mesh>
      <mesh position={[0, height + .06, 0]} receiveShadow><boxGeometry args={[width + .24, .12, depth + .12]} /><meshStandardMaterial color={room.wall} /></mesh>
      <mesh position={[width / 2 - .02, .09, 0]}><boxGeometry args={[.06, .18, depth]} /><meshStandardMaterial color={room.trim} /></mesh>
    </>}
    <mesh position={[0, .09, -depth / 2 + .02]}><boxGeometry args={[width, .18, .06]} /><meshStandardMaterial color={room.trim} /></mesh>
    <mesh position={[-width / 2 + .02, .09, 0]}><boxGeometry args={[.06, .18, depth]} /><meshStandardMaterial color={room.trim} /></mesh>
    {room.wallStyle !== 'Paint' && Array.from({ length: Math.min(40, Math.ceil(width / (room.wallStyle === 'Brick' ? .4 : .55))) }, (_, i) => {
      const x = -width / 2 + i * (room.wallStyle === 'Brick' ? .4 : .55);
      return <group key={i}>
        <mesh position={[x, 1.5, -depth / 2 + .015]}><boxGeometry args={[room.wallStyle === 'Stripes' ? .13 : .018, 2.8, .012]} /><meshStandardMaterial color={room.trim} transparent opacity={.3} /></mesh>
        {room.wallStyle === 'Paneling' && [1, 2.7].map((y) => <mesh key={y} position={[x + .25, y, -depth / 2 + .015]}><boxGeometry args={[.5, .018, .012]} /><meshStandardMaterial color={room.trim} /></mesh>)}
      </group>;
    })}
    {room.wallStyle === 'Brick' && Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[0, i * .2, -depth / 2 + .02]}><boxGeometry args={[width, .012, .012]} /><meshStandardMaterial color={room.trim} transparent opacity={.4} /></mesh>)}
    <mesh position={[0, height - cornice / 2, -depth / 2 + .1]}><boxGeometry args={[width, cornice, .2]} /><meshStandardMaterial color={room.facade} /></mesh>
    {room.awningStyle !== 'None' && Array.from({ length: Math.ceil(width / .25) }, (_, i) => <mesh key={i} position={[-width / 2 + i * .25 + .125, 2.9, -depth / 2 + .25]} rotation={[.18, 0, 0]}><boxGeometry args={[.25, .08, .55]} /><meshStandardMaterial color={room.awningStyle === 'Striped' && i % 2 ? room.facade : room.awning} /></mesh>)}
    <TextPanel text={room.name} color={room.trim} background={room.wall} font={room.font} position={[0, 2.5, -depth / 2 + .08]} size={[Math.min(3, width * .65), .45]} />
    {grid && <gridHelper args={[Math.max(width, depth), Math.round(Math.max(width, depth) * 10), '#426654', '#9caa93']} position={[0, .015, 0]} userData={{ editorOnly: true }} />}
  </group>;
}

function Environment() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const generator = new PMREMGenerator(gl);
    const environment = new RoomEnvironment();
    const target = generator.fromScene(environment, .04);
    scene.environment = target.texture; scene.environmentIntensity = .45;
    invalidate();
    return () => { scene.environment = null; target.dispose(); environment.dispose(); generator.dispose(); };
  }, [gl, scene, invalidate]);
  return null;
}

function CameraControls({ design, preset, reset, controlsRef, dragging, interactive }: {
  design: Design; preset: Preset; reset: number; controlsRef: MutableRefObject<OrbitControls | null>; dragging: boolean; interactive: boolean;
}) {
  const { camera, gl, invalidate, size } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true; controls.dampingFactor = .12; controls.minDistance = 1.5; controls.maxDistance = 32;
    controls.maxPolarAngle = Math.PI / 2 - .025;
    controls.minAzimuthAngle = -Math.PI * .44; controls.maxAzimuthAngle = Math.PI * .44;
    const onChange = () => invalidate();
    controls.addEventListener('change', onChange);
    return () => { controls.removeEventListener('change', onChange); controls.dispose(); controlsRef.current = null; };
  }, [camera, gl, invalidate, controlsRef]);
  useEffect(() => { if (controlsRef.current) controlsRef.current.enabled = interactive && !dragging; }, [interactive, dragging, controlsRef]);
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (!interactive) {
      const interior = memoryInteriorCamera(design.room, size.width / Math.max(1, size.height));
      camera.position.set(...interior.position);
      if (camera instanceof PerspectiveCamera) { camera.fov = interior.fov; camera.updateProjectionMatrix(); }
      controls.target.set(...interior.target);
      controls.update(); invalidate();
      return;
    }
    const extent = Math.max(design.room.width, design.room.depth) / 100;
    const distance = extent * (size.width < size.height ? 1.8 : 1.25);
    const position: Triple = preset === 'Front' ? [0, distance * .35, distance] : preset === 'Overhead' ? [0, distance, .01] : [distance * .45, distance * .55, distance * .85];
    camera.position.set(...position); controls.target.set(0, .7, 0); controls.update(); invalidate();
  }, [camera, design.room.width, design.room.depth, preset, reset, size.width, size.height, invalidate, controlsRef, interactive]);
  useFrame(() => { controlsRef.current?.update(); });
  return null;
}

type DragState = { item: Furnishing; start: Vector3; pointerId: number };
function Interior({ props, preset, reset, capture, onContextLost }: {
  props: Props; preset: Preset; reset: number; capture: (exportPng: (() => void) | null) => void; onContextLost: () => void;
}) {
  const { design, selectedId, onSelect, onMove, snap, grid, preview, orbit, showLights = true, backdrop } = props;
  const { gl, scene, camera, invalidate } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [moving, setMoving] = useState<Furnishing | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const movingRef = useRef<Furnishing | null>(null);
  const floorPlane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), []);
  const palette = useMemo<Palette>(() => ({
    glass: new MeshPhysicalMaterial({ color: '#c4e0dc', transmission: .75, roughness: .08, thickness: .03, transparent: true, opacity: .8, side: DoubleSide }),
    leaf: new MeshStandardMaterial({ color: '#799466', roughness: .85 }),
    bulb: new MeshStandardMaterial({ color: '#ffe8b4', emissive: '#ffcf77', emissiveIntensity: 1.3 }),
    dark: new MeshStandardMaterial({ color: '#354037', roughness: .7 }),
    paper: new MeshStandardMaterial({ color: '#f5ead0', roughness: .8 }),
    coffee: new MeshStandardMaterial({ color: '#a7794b', roughness: .65 }),
    pot: new MeshStandardMaterial({ color: PLANT_POT_COLOR, roughness: .8 }),
  }), []);
  useEffect(() => () => Object.values(palette).forEach((material) => material.dispose()), [palette]);
  useEffect(() => {
    capture(() => {
      const guides: Object3D[] = [];
      scene.traverse((object) => { if (object.userData.editorOnly && object.visible) { guides.push(object); object.visible = false; } });
      try {
        gl.render(scene, camera);
        gl.domElement.toBlob((blob) => {
          if (!blob) { props.onError?.('The 3D picture could not be exported. Try the illustrated SVG export.'); return; }
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = 'my-cafe-3d.png'; a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 'image/png');
      } catch (error) {
        console.error('Could not export the 3D cafe.', error);
        props.onError?.('The 3D picture could not be exported. Try the illustrated SVG export.');
      } finally {
        guides.forEach((object) => { object.visible = true; }); invalidate();
      }
    });
    return () => capture(null);
  }, [gl, scene, camera, capture, invalidate, props.onError]);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onContextLost(); };
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl, onContextLost]);
  useEffect(() => {
    const canvas = gl.domElement;
    const cancel = () => { dragRef.current = null; movingRef.current = null; setDrag(null); setMoving(null); if (controlsRef.current) controlsRef.current.enabled = !backdrop; };
    canvas.addEventListener('pointercancel', cancel); canvas.addEventListener('lostpointercapture', cancel);
    return () => { canvas.removeEventListener('pointercancel', cancel); canvas.removeEventListener('lostpointercapture', cancel); };
  }, [gl, backdrop]);
  const effectiveDesign = moving ? { ...design, items: design.items.map((item) => item.id === moving.id ? moving : item) } : design;
  const updateMove = (event: ThreeEvent<PointerEvent>) => {
    const active = dragRef.current;
    if (!active || active.pointerId !== event.pointerId) return;
    event.stopPropagation();
    const hit = event.ray.intersectPlane(floorPlane, new Vector3());
    if (!hit) return;
    const next = fitItem(moveOnFloor(active.item, hit.x - active.start.x, hit.z - active.start.z), design.room, snap);
    movingRef.current = next; setMoving(next);
  };
  const commitMove = (event: ThreeEvent<PointerEvent>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    event.stopPropagation();
    if (movingRef.current) onMove?.(movingRef.current);
    dragRef.current = null; movingRef.current = null; setDrag(null); setMoving(null);
    if (controlsRef.current) controlsRef.current.enabled = !backdrop;
    if (event.target && 'releasePointerCapture' in event.target && typeof event.target.releasePointerCapture === 'function') event.target.releasePointerCapture(event.pointerId);
  };
  const lights = effectiveDesign.items.filter((item) => !item.hidden && isLight(item) && item.lightPower > 0).slice(0, 6);
  return <PaletteContext.Provider value={palette}>
    <color attach="background" args={[design.room.night ? '#242f32' : '#e8e7db']} />
    <ambientLight intensity={design.room.night ? .12 : .22} />
    <hemisphereLight args={['#fff2d5', '#686f5a', .35 + design.room.light / 180]} />
    <directionalLight position={[-3, 7, 4]} intensity={(design.room.night ? .35 : 1.7) * (.25 + design.room.light / 100)} color={design.room.warmth > 50 ? '#ffe1af' : '#fff4df'} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-bias={-.0005} />
    {showLights && lights.map((item) => { const p = position3d(item, effectiveDesign); return <pointLight key={item.id} position={[p[0], p[1] + height3d(item) * .6, p[2] + .1]} intensity={item.lightPower / 55} distance={4} color={item.lightWarmth > 50 ? '#ffd59b' : '#cce9ff'} decay={2} />; })}
    <Environment />
    <CameraControls design={design} preset={preset} reset={reset} controlsRef={controlsRef} dragging={Boolean(drag)} interactive={!backdrop} />
    <RoomShell room={design.room} grid={Boolean(grid && !preview)} interior={Boolean(backdrop)} />
    <group onPointerMove={updateMove} onPointerUp={commitMove}>
      {effectiveDesign.items.filter((item) => !item.hidden && (showLights || !isLight(item))).map((item) => <Furniture key={item.id} item={item} design={effectiveDesign} selected={!preview && selectedId === item.id} onPointerDown={(event) => {
        if (backdrop || preview || orbit || event.button !== 0 || dragRef.current) return;
        event.stopPropagation(); onSelect?.(item.id);
        gl.domElement.focus({ preventScroll: true });
        if (item.locked || !onMove) return;
        const hit = event.ray.intersectPlane(floorPlane, new Vector3());
        if (!hit) return;
        const active = { item, start: hit, pointerId: event.pointerId };
        if (controlsRef.current) controlsRef.current.enabled = false;
        dragRef.current = active; setDrag(active);
        if (event.target && 'setPointerCapture' in event.target && typeof event.target.setPointerCapture === 'function') event.target.setPointerCapture(event.pointerId);
        invalidate();
      }} />)}
    </group>
  </PaletteContext.Provider>;
}

export default function Cafe3D(props: Props) {
  const [preset, setPreset] = useState<Preset>('Front');
  const [reset, setReset] = useState(0);
  const exporter = useRef<(() => void) | null>(null);
  const [lost, setLost] = useState(false);
  const capture = useMemo(() => (exportPng: (() => void) | null) => { exporter.current = exportPng; }, []);
  const onContextLost = () => {
    console.error('The cafe WebGL context was lost.');
    setLost(true); props.onError?.('The 3D graphics context was lost. Your design is safe. Switch to Illustrated or reopen 3D to retry.');
  };
  const fallback = <div className="studio-3d-fallback" role="status"><DesignScene design={props.design} /><p>3D is unavailable on this device. Showing your illustrated design instead.</p></div>;
  useEffect(() => {
    if (!props.handleRef) return;
    props.handleRef.current = { exportPng: () => {
      if (!exporter.current || lost) { props.onError?.('No 3D image is available. Switch to Illustrated to export an SVG instead.'); return; }
      exporter.current();
    } };
    return () => { if (props.handleRef) props.handleRef.current = null; };
  }, [props.handleRef, props.onError, lost]);
  return <div className={`studio-three${props.backdrop ? ' studio-three--backdrop' : ''}`}>
    <SceneBoundary fallback={fallback} onError={props.onError}>
      {lost ? fallback : <Canvas shadows dpr={[1, 1.5]} frameloop="demand" camera={{ position: [0, 4, 12], fov: 45, near: .1, far: 100 }}
        gl={{ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
        fallback={fallback} onPointerMissed={() => props.onSelect?.(null)}
        onCreated={({ gl }) => { gl.shadowMap.type = PCFSoftShadowMap; gl.domElement.tabIndex = props.backdrop ? -1 : 0; gl.domElement.setAttribute('aria-label', '3D cafe interior. Use Layers and Details to edit without dragging.'); }}>
        <Interior props={props} preset={preset} reset={reset} capture={capture} onContextLost={onContextLost} />
      </Canvas>}
    </SceneBoundary>
    {!props.backdrop && <div className="studio-camera-tools" aria-label="3D camera">
      {(['Front', 'Perspective', 'Overhead'] as Preset[]).map((view) => <button key={view} aria-pressed={preset === view} onClick={() => { setPreset(view); setReset((value) => value + 1); }}>{view}</button>)}
      <button onClick={() => setReset((value) => value + 1)}>Reset camera</button>
    </div>}
  </div>;
}
