import { Component, createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ErrorInfo, MutableRefObject, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  BoxGeometry, CanvasTexture, Color, CylinderGeometry, DoubleSide, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, PCFSoftShadowMap,
  PerspectiveCamera, Plane, PMREMGenerator, Raycaster, SphereGeometry, SRGBColorSpace, TorusGeometry, Vector2, Vector3,
} from 'three';
import type { Material as ThreeMaterial, Object3D } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MaterialSample } from './MaterialFinish';
import { isOutdoorFloorStyle, OutdoorFloorTile } from './FloorFinish';
import { DesignScene } from './StudioArtwork';
import { areaAtFloor, designAreas, framePanels, layoutAreas, layoutBounds, furnishingRole, furnitureLegFinish, hasFurnitureLegs, isPlant, PLANT_POT_COLOR } from './studioModel';
import type { Design, FrameImage, Furnishing, Material, Pattern, Room } from './studioModel';
import { fitItem } from './studioModel';
import { furnitureParts, height3d, isLight, materialPhysics, memoryInteriorCamera, moveOnFloor, position3d } from './studio3dModel';
import type { Finish, Part, Triple } from './studio3dModel';
import { SharedResourcePool, tabletGraphicsDefault } from './studio3dResources';
import { frameImageRect } from './studioImages';

type Preset = 'Front' | 'Perspective' | 'Overhead';
type FloorPlacement = { areaId: string; x: number; y: number };
type ScreenPicker = (x: number, y: number) => FloorPlacement | null;
export interface Cafe3DHandle { exportPng: () => void; screenToFloor: ScreenPicker }
interface Props {
  design: Design;
  activeAreaId?: string;
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

interface FinishResource {
  material: ThreeMaterial;
  subscribe: (listener: (error: string) => void) => () => void;
  dispose: () => void;
}
const RenderResources = createContext<{
  finishes: SharedResourcePool<FinishResource>;
  pending: ThreeMaterial;
  geometries: { box: BoxGeometry; sphere: SphereGeometry; cylinder: CylinderGeometry; torus: TorusGeometry };
  reduced: boolean;
} | null>(null);

function createFinish(material: Material, color: string, accent: string, pattern: Pattern, opacity: number, reduced: boolean, invalidate: () => void): FinishResource {
  const physics = materialPhysics(material);
  const common = { color: '#ffffff', roughness: physics.roughness, metalness: physics.metalness,
    transparent: opacity < 1 || material === 'Glass', opacity: material === 'Glass' && reduced ? opacity * .65 : opacity, side: DoubleSide };
  const finish = reduced ? new MeshStandardMaterial(common) : new MeshPhysicalMaterial({
    ...common, ...physics, thickness: .08, ior: 1.45,
    sheen: material === 'Velvet' || material === 'Boucle' ? .7 : 0, sheenColor: new Color(color),
  });
  let active = true;
  let texture: CanvasTexture | undefined;
  let error: string | null = null;
  const listeners = new Set<(error: string) => void>();
  const fail = (message: string) => { if (active) { error = message; listeners.forEach((listener) => listener(message)); } };
  const image = new Image();
  image.onload = () => {
    if (!active) return;
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = reduced ? 128 : 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) { fail('Could not create the 3D material texture.'); return; }
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace;
    finish.map = texture; finish.needsUpdate = true; invalidate();
  };
  image.onerror = () => fail(`Could not load the ${material} texture.`);
  const svg = renderToStaticMarkup(<MaterialSample material={material} color={color} accent={accent} pattern={pattern} seamless />)
    .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return {
    material: finish,
    subscribe: (listener) => { listeners.add(listener); if (error) listener(error); return () => { listeners.delete(listener); }; },
    dispose: () => { active = false; image.onload = null; image.onerror = null; listeners.clear(); texture?.dispose(); finish.dispose(); },
  };
}

function useFinish(material: Material, color: string, accent: string, pattern: Pattern, opacity: number, enabled = true) {
  const resources = useContext(RenderResources)!;
  const invalidate = useThree((state) => state.invalidate);
  const [current, setCurrent] = useState<{ owner: typeof resources; resource: FinishResource } | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const lease = resources.finishes.acquire(JSON.stringify([material, color, accent, pattern, opacity]),
      () => createFinish(material, color, accent, pattern, opacity, resources.reduced, invalidate));
    const unsubscribe = lease.resource.subscribe(setError);
    setCurrent({ owner: resources, resource: lease.resource });
    invalidate();
    return () => { unsubscribe(); lease.release(); };
  }, [material, color, accent, pattern, opacity, resources, invalidate, enabled]);
  if (error) throw new Error(error);
  return current?.owner === resources ? current.resource.material : resources.pending;
}

function createPicture(image: FrameImage, ratio: number, opacity: number, reduced: boolean, invalidate: () => void): FinishResource {
  const material = new MeshBasicMaterial({ color: '#ffffff', toneMapped: false, transparent: opacity < 1, opacity, side: DoubleSide });
  let active = true;
  let texture: CanvasTexture | undefined;
  let error: string | null = null;
  const listeners = new Set<(error: string) => void>();
  const fail = () => {
    if (!active) return;
    const message = 'A frame picture could not be displayed. Replace or remove it in Details.';
    error = message; listeners.forEach((listener) => listener(message));
  };
  const source = new Image();
  source.onload = () => {
    if (!active) return;
    const canvas = document.createElement('canvas'), longest = reduced ? 256 : 1024;
    canvas.width = Math.max(1, Math.round(longest * Math.min(1, ratio)));
    canvas.height = Math.max(1, Math.round(longest / Math.max(1, ratio)));
    const context = canvas.getContext('2d');
    if (!context) { fail(); return; }
    context.fillStyle = '#f5e5c4'; context.fillRect(0, 0, canvas.width, canvas.height);
    const rect = frameImageRect(source.naturalWidth, source.naturalHeight, canvas.width, canvas.height, image.fit);
    context.drawImage(source, rect.x, rect.y, rect.width, rect.height);
    texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace;
    material.map = texture; material.needsUpdate = true; invalidate();
  };
  source.onerror = fail; source.src = image.src;
  return {
    material,
    subscribe: (listener) => { listeners.add(listener); if (error) listener(error); return () => { listeners.delete(listener); }; },
    dispose: () => { active = false; source.onload = null; source.onerror = null; listeners.clear(); texture?.dispose(); material.dispose(); },
  };
}

function FramePicture({ image, ratio, opacity, position, size, onError }: {
  image: FrameImage; ratio: number; opacity: number; position: Triple; size: [number, number]; onError?: Props['onError'];
}) {
  const resources = useContext(RenderResources)!;
  const invalidate = useThree((state) => state.invalidate);
  const [current, setCurrent] = useState<{ owner: typeof resources; resource: FinishResource } | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setError(null);
    const lease = resources.finishes.acquire(JSON.stringify(['picture', image.src, image.fit, ratio, opacity]),
      () => createPicture(image, ratio, opacity, resources.reduced, invalidate));
    const unsubscribe = lease.resource.subscribe(setError);
    setCurrent({ owner: resources, resource: lease.resource }); invalidate();
    return () => { unsubscribe(); lease.release(); };
  }, [image.src, image.fit, ratio, opacity, resources, invalidate]);
  useEffect(() => { if (error) { console.error(error); onError?.(error); } }, [error, onError]);
  return <mesh position={position} material={error || current?.owner !== resources ? resources.pending : current.resource.material}>
    <planeGeometry args={size} />
  </mesh>;
}

type Palette = Record<Exclude<Finish, 'main' | 'accent' | 'legs'>, ThreeMaterial>;
const PaletteContext = createContext<Palette | null>(null);

function Primitive({ part, main, accent, legs }: { part: Part; main: ThreeMaterial; accent: ThreeMaterial; legs: ThreeMaterial }) {
  const palette = useContext(PaletteContext)!;
  const resources = useContext(RenderResources)!;
  const material = part.finish === 'main' ? main : part.finish === 'accent' ? accent : part.finish === 'legs' ? legs : palette[part.finish];
  return <mesh geometry={resources.geometries[part.geometry]} position={part.position} scale={part.size} rotation={part.rotation} material={material} castShadow receiveShadow />;
}

function TextPanel({ text, color, background, font, position, size, opacity = 1 }: {
  text: string; color: string; background: string; font: string; position: Triple; size: [number, number]; opacity?: number;
}) {
  const reduced = useContext(RenderResources)!.reduced;
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = reduced ? 256 : 1024; canvas.height = Math.max(reduced ? 32 : 128, Math.round(canvas.width * size[1] / size[0]));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create the cafe signage canvas.');
    ctx.fillStyle = background; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const lines = text.split('\n').slice(0, 7);
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const fontSize = canvas.height * .72 / Math.max(1, lines.length);
    ctx.font = `${fontSize}px ${font}`;
    lines.forEach((line, i) => ctx.fillText(line, canvas.width / 2, canvas.height / 2 + (i - (lines.length - 1) / 2) * fontSize * 1.15, canvas.width * .92));
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace; return map;
  }, [text, color, background, font, size[0], size[1], reduced]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={position}><planeGeometry args={size} /><meshBasicMaterial map={texture} side={DoubleSide} transparent={opacity < 1} opacity={opacity} /></mesh>;
}

function Furniture({ item, design, selected, onPointerDown, onError }: { item: Furnishing; design: Design; selected: boolean; onPointerDown?: (event: ThreeEvent<PointerEvent>) => void; onError?: Props['onError'] }) {
  const sharedPalette = useContext(PaletteContext)!;
  const palette = useMemo<Palette>(() => {
    if (item.opacity === 100) return sharedPalette;
    const fade = (source: ThreeMaterial) => { const result = source.clone(); result.transparent = true; result.opacity *= item.opacity / 100; return result; };
    return { glass: fade(sharedPalette.glass), leaf: fade(sharedPalette.leaf), bulb: fade(sharedPalette.bulb), dark: fade(sharedPalette.dark), paper: fade(sharedPalette.paper), coffee: fade(sharedPalette.coffee), pot: fade(sharedPalette.pot) };
  }, [sharedPalette, item.opacity]);
  useEffect(() => () => { if (palette !== sharedPalette) Object.values(palette).forEach((material) => material.dispose()); }, [palette, sharedPalette]);
  const main = useFinish(item.material, item.color, item.accent, item.pattern, item.opacity / 100, !isPlant(item.kind));
  const accent = useFinish(item.material, item.accent, item.color, 'Plain', item.opacity / 100, !isPlant(item.kind));
  const legFinish = furnitureLegFinish(item);
  const legs = useFinish(legFinish.legMaterial, legFinish.legColor, item.legColor ?? item.color, 'Plain', item.opacity / 100, hasFurnitureLegs(item.kind));
  const foliage = useMemo(() => new MeshStandardMaterial({ color: item.color, roughness: .85, transparent: item.opacity < 100, opacity: item.opacity / 100 }), [item.color, item.opacity]);
  useEffect(() => () => foliage.dispose(), [foliage]);
  const parts = useMemo(() => furnitureParts(item), [item.kind, item.shape, item.detail, item.images]);
  const role = furnishingRole(item.kind);
  return <PaletteContext.Provider value={palette}><group position={position3d(item, design)} rotation={[0, item.rotation * Math.PI / 180, 0]} onPointerDown={onPointerDown} name={`furnishing:${item.id}`}>
    <group scale={[item.width / 100, height3d(item), item.depth / 100]}>
      {parts.map((part, i) => <Primitive key={i} part={part.finish === 'leaf' && isPlant(item.kind) ? { ...part, finish: 'main' } : part} main={isPlant(item.kind) ? foliage : main} accent={accent} legs={legs} />)}
      {framePanels(item.kind).map((panel, i) => {
        const image = item.images?.[i];
        if (!image) return null;
        const w = (panel.width - panel.inset * 2) / 100, h = (panel.height - panel.inset * 2) / 100;
        return <FramePicture key={i} image={image} ratio={w * item.width / (h * height3d(item) * 100)} opacity={item.opacity / 100}
          position={[(panel.x + panel.width / 2) / 100 - .5, 1 - (panel.y + panel.height / 2) / 100, .102]} size={[w, h]} onError={onError} />;
      })}
      {['sign', 'menu'].includes(role) && <TextPanel text={item.text} color={role === 'menu' ? item.accent : item.color} background={role === 'menu' ? item.color : item.accent} font={item.font} opacity={item.opacity / 100} position={[0, .52, .11]} size={[.76, .74]} />}
      {selected && <mesh position={[0, .5, 0]} userData={{ editorOnly: true }}><boxGeometry args={[1.06, 1.06, 1.06]} /><meshBasicMaterial color="#d19b35" wireframe transparent opacity={.8} /></mesh>}
    </group>
    {isLight(item) && item.lightPower > 0 && <mesh position={[0, height3d(item) * .75, 0]}><sphereGeometry args={[.05, 8, 8]} /><meshBasicMaterial color={item.lightWarmth > 50 ? '#ffe4a0' : '#d7efff'} transparent={item.opacity < 100} opacity={item.opacity / 100} /></mesh>}
  </group></PaletteContext.Provider>;
}

function RoomShell({ room, grid, interior, outdoor = false, leftWall = true, rightWall = true, frontRail = true }: { room: Room; grid: boolean; interior: boolean; outdoor?: boolean; leftWall?: boolean; rightWall?: boolean; frontRail?: boolean }) {
  const invalidate = useThree((state) => state.invalidate);
  const [floorError, setFloorError] = useState<string | null>(null);
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
  useEffect(() => {
    if (!isOutdoorFloorStyle(room.floorStyle)) return;
    let active = true;
    const image = new Image();
    const tileWidth = room.floorScale / room.width * 512;
    const tileDepth = room.floorScale / room.depth * 512;
    const svg = renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <defs><pattern id="outdoor-floor" width={tileWidth} height={tileDepth} patternUnits="userSpaceOnUse">
        <svg width={tileWidth} height={tileDepth} viewBox="0 0 80 80" preserveAspectRatio="none"><OutdoorFloorTile style={room.floorStyle} color={room.floor} accent={room.floorAccent} /></svg>
      </pattern></defs>
      <rect width="512" height="512" fill="url(#outdoor-floor)" />
    </svg>);
    image.onload = () => {
      if (!active) return;
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
      const context = canvas.getContext('2d');
      if (!context) { setFloorError('Could not create the outdoor floor texture.'); return; }
      context.drawImage(image, 0, 0, 512, 512);
      texture.image = canvas; texture.needsUpdate = true; invalidate();
    };
    image.onerror = () => { if (active) setFloorError(`Could not load the ${room.floorStyle} floor texture.`); };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    return () => { active = false; image.onload = null; image.onerror = null; };
  }, [room.floorStyle, room.floor, room.floorAccent, room.floorScale, room.width, room.depth, texture, invalidate]);
  if (floorError) throw new Error(floorError);
  return <group>
    <mesh position={[0, -.07, 0]} receiveShadow><boxGeometry args={[width + .12, .14, depth + .12]} /><meshStandardMaterial color={room.floor} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .002, 0]} receiveShadow><planeGeometry args={[width, depth]} /><meshStandardMaterial map={texture} roughness={isOutdoorFloorStyle(room.floorStyle) ? .95 : .65} /></mesh>
    {!outdoor && <>
    <mesh position={[0, height / 2, -depth / 2 - .06]} receiveShadow><boxGeometry args={[width + .2, height, .12]} /><meshStandardMaterial color={room.wall} /></mesh>
    {leftWall && <mesh position={[-width / 2 - .06, height / 2, 0]} receiveShadow><boxGeometry args={[.12, height, depth]} /><meshStandardMaterial color={room.wall} /></mesh>}
    {interior && <>
      {rightWall && <mesh position={[width / 2 + .06, height / 2, 0]} receiveShadow><boxGeometry args={[.12, height, depth]} /><meshStandardMaterial color={room.wall} /></mesh>}
      <mesh position={[0, height + .06, 0]} receiveShadow><boxGeometry args={[width + .24, .12, depth + .12]} /><meshStandardMaterial color={room.wall} /></mesh>
      {rightWall && <mesh position={[width / 2 - .02, .09, 0]}><boxGeometry args={[.06, .18, depth]} /><meshStandardMaterial color={room.trim} /></mesh>}
    </>}
    <mesh position={[0, .09, -depth / 2 + .02]}><boxGeometry args={[width, .18, .06]} /><meshStandardMaterial color={room.trim} /></mesh>
    {leftWall && <mesh position={[-width / 2 + .02, .09, 0]}><boxGeometry args={[.06, .18, depth]} /><meshStandardMaterial color={room.trim} /></mesh>}
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
    <TextPanel text={room.name} color={room.nameColor ?? room.trim} background={room.wall} font={room.font} position={[0, 2.5, -depth / 2 + .08]} size={[Math.min(3, width * .65), .45]} />
    </>}
    {outdoor && frontRail && <>
      <mesh position={[0, .35, depth / 2]}><boxGeometry args={[width, .7, .07]} /><meshStandardMaterial color={room.trim} /></mesh>
      <TextPanel text={room.name} color={room.nameColor ?? room.trim} background={room.floor} font={room.font} position={[0, .4, depth / 2 + .05]} size={[Math.min(3, width * .65), .3]} />
    </>}
    {grid && <gridHelper args={[Math.max(width, depth), Math.round(Math.max(width, depth) * 10), '#426654', '#9caa93']} position={[0, .015, 0]} userData={{ editorOnly: true }} />}
  </group>;
}

function Environment({ generation }: { generation: number }) {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const generator = new PMREMGenerator(gl);
    const environment = new RoomEnvironment();
    const target = generator.fromScene(environment, .04);
    environment.dispose(); generator.dispose();
    scene.environment = target.texture; scene.environmentIntensity = .45;
    const release = () => { scene.environment = null; target.dispose(); };
    gl.domElement.addEventListener('webglcontextlost', release);
    invalidate();
    return () => { gl.domElement.removeEventListener('webglcontextlost', release); release(); };
  }, [gl, scene, invalidate, generation]);
  return null;
}

function CameraControls({ design, preset, reset, controlsRef, dragging, interactive }: {
  design: Design; preset: Preset; reset: number; controlsRef: MutableRefObject<OrbitControls | null>; dragging: boolean; interactive: boolean;
}) {
  const { camera, gl, invalidate, size } = useThree();
  const bounds = layoutBounds(design);
  const layoutWidth = bounds.width / 100;
  const layoutDepth = bounds.depth / 100;
  const centerX = bounds.x / 100;
  const centerZ = bounds.z / 100;
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
    const extent = Math.max(layoutWidth, layoutDepth);
    const distance = extent * (size.width < size.height ? 1.8 : 1.25);
    const position: Triple = preset === 'Front' ? [0, distance * .35, distance] : preset === 'Overhead' ? [0, distance, .01] : [distance * .45, distance * .55, distance * .85];
    controls.maxDistance = Math.max(32, distance * 2);
    camera.far = Math.max(100, distance * 4); camera.updateProjectionMatrix();
    camera.position.set(position[0] + centerX, position[1], position[2] + centerZ); controls.target.set(centerX, .7, centerZ); controls.update(); invalidate();
  }, [camera, design.room.width, design.room.depth, layoutWidth, layoutDepth, centerX, centerZ, preset, reset, size.width, size.height, invalidate, controlsRef, interactive]);
  useFrame(() => { controlsRef.current?.update(); });
  return null;
}

type DragState = { item: Furnishing; start: Vector3; pointerId: number };
function Interior({ props, preset, reset, capture, pickerRef, reduced, recovery, onContextLost, onContextRestored }: {
  props: Props; preset: Preset; reset: number; capture: (exportPng: (() => void) | null) => void; pickerRef: MutableRefObject<ScreenPicker | null>;
  reduced: boolean; recovery: number; onContextLost: () => void; onContextRestored: () => void;
}) {
  const { design, selectedId, onSelect, onMove, snap, grid, preview, orbit, showLights = true, backdrop } = props;
  const { gl, scene, camera, invalidate } = useThree();
  const resources = useMemo(() => ({
    finishes: new SharedResourcePool<FinishResource>(),
    pending: new MeshStandardMaterial({ color: '#ded8c4', roughness: .8 }),
    geometries: { box: new BoxGeometry(1, 1, 1), sphere: new SphereGeometry(.5, 14, 10), cylinder: new CylinderGeometry(.5, .5, 1, 18), torus: new TorusGeometry(.4, .1, 6, 20) },
    reduced, mounted: false,
  }), [reduced]);
  useEffect(() => {
    resources.mounted = true;
    return () => {
      resources.mounted = false;
      queueMicrotask(() => {
        if (resources.mounted) return;
        resources.finishes.dispose(); resources.pending.dispose();
        Object.values(resources.geometries).forEach((geometry) => geometry.dispose());
      });
    };
  }, [resources]);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [moving, setMoving] = useState<Furnishing | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const movingRef = useRef<Furnishing | null>(null);
  const floorPlane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), []);
  useEffect(() => {
    pickerRef.current = (x, y) => {
      const rect = gl.domElement.getBoundingClientRect();
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom || !rect.width || !rect.height) return null;
      const ray = new Raycaster();
      ray.setFromCamera(new Vector2((x - rect.left) / rect.width * 2 - 1, -(y - rect.top) / rect.height * 2 + 1), camera);
      const hit = ray.ray.intersectPlane(floorPlane, new Vector3());
      return hit ? areaAtFloor(design, hit.x * 100, hit.z * 100) : null;
    };
    return () => { pickerRef.current = null; };
  }, [gl, camera, design, floorPlane, pickerRef]);
  const palette = useMemo<Palette>(() => ({
    glass: reduced ? new MeshStandardMaterial({ color: '#c4e0dc', roughness: .15, transparent: true, opacity: .45, side: DoubleSide })
      : new MeshPhysicalMaterial({ color: '#c4e0dc', transmission: .75, roughness: .08, thickness: .03, transparent: true, opacity: .8, side: DoubleSide }),
    leaf: new MeshStandardMaterial({ color: '#799466', roughness: .85 }),
    bulb: new MeshStandardMaterial({ color: '#ffe8b4', emissive: '#ffcf77', emissiveIntensity: 1.3 }),
    dark: new MeshStandardMaterial({ color: '#354037', roughness: .7 }),
    paper: new MeshStandardMaterial({ color: '#f5ead0', roughness: .8 }),
    coffee: new MeshStandardMaterial({ color: '#a7794b', roughness: .65 }),
    pot: new MeshStandardMaterial({ color: PLANT_POT_COLOR, roughness: .8 }),
  }), [reduced]);
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
    const contextLossExtension = gl.getContext().getExtension('WEBGL_lose_context');
    let restoreTimer: ReturnType<typeof setTimeout> | undefined;
    const lost = (event: Event) => {
      event.preventDefault(); onContextLost();
      if (restoreTimer) clearTimeout(restoreTimer);
      restoreTimer = setTimeout(() => {
        if (gl.getContext().isContextLost()) contextLossExtension?.restoreContext();
      }, 500);
    };
    const restored = () => { if (restoreTimer) clearTimeout(restoreTimer); onContextRestored(); invalidate(); };
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', restored);
    return () => { if (restoreTimer) clearTimeout(restoreTimer); canvas.removeEventListener('webglcontextlost', lost); canvas.removeEventListener('webglcontextrestored', restored); };
  }, [gl, onContextLost, onContextRestored, invalidate]);
  useEffect(() => {
    const canvas = gl.domElement;
    const cancel = () => { dragRef.current = null; movingRef.current = null; setDrag(null); setMoving(null); if (controlsRef.current) controlsRef.current.enabled = !backdrop; };
    canvas.addEventListener('pointercancel', cancel); canvas.addEventListener('lostpointercapture', cancel);
    return () => { canvas.removeEventListener('pointercancel', cancel); canvas.removeEventListener('lostpointercapture', cancel); };
  }, [gl, backdrop]);
  const effectiveDesign = moving ? { ...design, items: design.items.map((item) => item.id === moving.id ? moving : item),
    ...(design.areas ? { areas: design.areas.map((area) => ({ ...area, items: area.items.map((item) => item.id === moving.id ? moving : item) })) } : {}) } : design;
  const updateMove = (event: ThreeEvent<PointerEvent>) => {
    const active = dragRef.current;
    if (!active || active.pointerId !== event.pointerId) return;
    event.stopPropagation();
    const hit = event.ray.intersectPlane(floorPlane, new Vector3());
    if (!hit) return;
    const area = designAreas(design).find((area) => area.items.some((item) => item.id === active.item.id))!;
    const next = fitItem(moveOnFloor(active.item, hit.x - active.start.x, hit.z - active.start.z), area.room, snap);
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
  const areas = layoutAreas(effectiveDesign);
  const lights = areas.flatMap((area) => area.items.filter((item) => !item.hidden && isLight(item) && item.lightPower > 0).map((item) => ({ area, item })))
    .sort((a, b) => b.item.lightPower - a.item.lightPower).slice(0, reduced ? 3 : 6);
  return <RenderResources.Provider value={resources}><PaletteContext.Provider value={palette}>
    <color attach="background" args={[design.room.night ? '#242f32' : '#e8e7db']} />
    <ambientLight intensity={design.room.night ? .12 : .22} />
    <hemisphereLight args={['#fff2d5', '#686f5a', .35 + design.room.light / 180]} />
    <directionalLight position={[-3, 7, 4]} intensity={(design.room.night ? .35 : 1.7) * (.25 + design.room.light / 100)} color={design.room.warmth > 50 ? '#ffe1af' : '#fff4df'} castShadow shadow-mapSize={reduced ? [512, 512] : [1024, 1024]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-bias={-.0005} />
    {showLights && lights.map(({ item, area }) => { const p = position3d(item, area); return <pointLight key={item.id} position={[p[0] + area.x / 100, p[1] + height3d(item) * .6, p[2] + area.z / 100 + .1]} intensity={item.lightPower / 55} distance={4} color={item.lightWarmth > 50 ? '#ffd59b' : '#cce9ff'} decay={2} />; })}
    <Environment generation={recovery} />
    <CameraControls design={design} preset={preset} reset={reset} controlsRef={controlsRef} dragging={Boolean(drag)} interactive={!backdrop} />
    <group onPointerMove={updateMove} onPointerUp={commitMove}>
      {areas.map((area, index) => <group key={area.id} position={[area.x / 100, 0, area.z / 100]}>
      {index > 0 && <pointLight position={[0, 3, 0]} intensity={(area.room.night ? .35 : 1) * area.room.light / 35} distance={Math.max(area.room.width, area.room.depth) / 80} color={area.room.warmth > 50 ? '#ffe1af' : '#fff4df'} />}
      <RoomShell room={area.room} grid={Boolean(grid && !preview && (props.activeAreaId ?? 'main') === area.id)} interior={Boolean(backdrop)} outdoor={area.outdoor} leftWall={index === 0} rightWall={area.id === areas.filter((entry) => !entry.outdoor).at(-1)?.id} frontRail={area.id === areas.filter((entry) => entry.outdoor).at(-1)?.id} />
      {area.items.filter((item) => !item.hidden && (showLights || !isLight(item))).map((item) => <Furniture key={item.id} item={item} design={area} selected={!preview && selectedId === item.id} onError={props.onError} onPointerDown={(event) => {
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
      </group>)}
    </group>
  </PaletteContext.Provider></RenderResources.Provider>;
}

export default function Cafe3D(props: Props) {
  const [preset, setPreset] = useState<Preset>('Front');
  const [reset, setReset] = useState(0);
  const exporter = useRef<(() => void) | null>(null);
  const pickerRef = useRef<ScreenPicker | null>(null);
  const [contextState, setContextState] = useState<'ready' | 'lost' | 'failed'>('ready');
  const [reduced, setReduced] = useState(() => tabletGraphicsDefault(navigator.maxTouchPoints ?? 0, window.matchMedia('(pointer: coarse)').matches));
  const [generation, setGeneration] = useState(0);
  const [recovery, setRecovery] = useState(0);
  const capture = useMemo(() => (exportPng: (() => void) | null) => { exporter.current = exportPng; }, []);
  const onContextLost = useCallback(() => {
    console.warn('The cafe WebGL context was lost; attempting recovery with tablet graphics.');
    setContextState('lost'); setReduced(true);
  }, []);
  const onContextRestored = useCallback(() => {
    console.info('The cafe WebGL context was restored.');
    setContextState('ready'); setRecovery((value) => value + 1);
  }, []);
  useEffect(() => {
    if (contextState !== 'lost') return;
    const timer = setTimeout(() => {
      console.error('The cafe WebGL context could not recover within 8 seconds.');
      setContextState('failed');
      props.onError?.('3D graphics paused because the device lost its graphics context. Your design is saved. Retry 3D with tablet graphics or continue in Illustrated.');
    }, 8000);
    return () => clearTimeout(timer);
  }, [contextState, props.onError]);
  const retry = () => {
    setContextState('ready'); setReduced(true); setGeneration((value) => value + 1);
  };
  const fallback = <div className="studio-3d-fallback" role="status"><DesignScene design={props.design} /><p>3D is unavailable right now. Your design is safe.</p><button onClick={retry}>Retry 3D with tablet graphics</button></div>;
  useEffect(() => {
    if (!props.handleRef) return;
    props.handleRef.current = { screenToFloor: (x, y) => contextState !== 'ready' ? null : pickerRef.current?.(x, y) ?? null, exportPng: () => {
      if (!exporter.current || contextState !== 'ready') { props.onError?.('No 3D image is available. Switch to Illustrated to export an SVG instead.'); return; }
      exporter.current();
    } };
    return () => { if (props.handleRef) props.handleRef.current = null; };
  }, [props.handleRef, props.onError, contextState]);
  return <div className={`studio-three${props.backdrop ? ' studio-three--backdrop' : ''}`}>
    <SceneBoundary key={generation} fallback={fallback} onError={props.onError}>
      <Canvas shadows dpr={reduced ? 1 : [1, 1.5]} frameloop="demand" camera={{ position: [0, 4, 12], fov: 45, near: .1, far: 100 }}
        gl={{ antialias: !reduced, preserveDrawingBuffer: false, powerPreference: 'default' }}
        fallback={fallback} onPointerMissed={() => props.onSelect?.(null)}
        onCreated={({ gl }) => { gl.shadowMap.type = PCFSoftShadowMap; gl.domElement.tabIndex = props.backdrop ? -1 : 0; gl.domElement.setAttribute('aria-label', '3D cafe interior. Use Layers and Details to edit without dragging.'); }}>
        <Interior props={props} preset={preset} reset={reset} capture={capture} pickerRef={pickerRef} reduced={reduced} recovery={recovery} onContextLost={onContextLost} onContextRestored={onContextRestored} />
      </Canvas>
    </SceneBoundary>
    {contextState !== 'ready' && <div className="studio-context-message" role="status">
      {contextState === 'lost' ? <p>Restoring 3D graphics with tablet settings. Your design is safe...</p> : fallback}
    </div>}
    {!props.backdrop && <div className="studio-camera-tools" aria-label="3D camera">
      {(['Front', 'Perspective', 'Overhead'] as Preset[]).map((view) => <button key={view} aria-pressed={preset === view} onClick={() => { setPreset(view); setReset((value) => value + 1); }}>{view}</button>)}
      <button onClick={() => setReset((value) => value + 1)}>Reset camera</button>
      <button aria-pressed={reduced} title="Tablet graphics reduce GPU memory, shadows, and refraction without changing your design." onClick={() => { setReduced(!reduced); setGeneration((value) => value + 1); setContextState('ready'); }}>Graphics: {reduced ? 'Tablet' : 'Standard'}</button>
    </div>}
  </div>;
}
