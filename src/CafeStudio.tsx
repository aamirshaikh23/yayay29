import { useEffect, useReducer, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { FurnishingArt, PlacedFurnishing, RoomArtwork, RoomAtmosphere } from './StudioArtwork';
import {
  applyTheme, briefChecks, briefs, catalog, categories, createDesign, decodeStudioSave, designStats, fitItem,
  floorStyles, fonts, furnishingRole, historyReducer, materials, MAX_ITEMS, newItem, patterns, resizeRoom, STUDIO_KEY, themes, wallStyles,
} from './studioModel';
import type { Category, Design, Furnishing, Room, SavedDesign, StudioSave } from './studioModel';
import { moveInScene, scenePlacement, SCENE_HEIGHT, SCENE_VIEWBOX, SCENE_WIDTH } from './studioView';
import './studio.css';

function loadStudio(): { save: StudioSave; error: string } {
  try {
    const raw = localStorage.getItem(STUDIO_KEY);
    return { save: raw ? decodeStudioSave(JSON.parse(raw)) : { version: 1, current: createDesign(), slots: [] }, error: '' };
  } catch (error) {
    console.error('Could not restore the cafe design studio.', error);
    return { save: { version: 1, current: createDesign(), slots: [] }, error: 'Your studio save could not be restored. The starter design is open; your stored data will not be overwritten until you choose to enable saving.' };
  }
}

function SelectField<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void }) {
  return <label className="studio-field"><span>{label}</span><select value={value} onChange={(event) => {
    const next = options.find((entry) => entry === event.target.value);
    if (next) onChange(next);
  }}>{options.map((entry) => <option key={entry}>{entry}</option>)}</select></label>;
}
function NumberField({ label, value, min, max, step = 1, unit = '', onChange }: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(Math.round(value * 10) / 10)), [value]);
  return <label className="studio-field studio-measure"><span>{label} <small>{unit}</small></span>
    <div><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} aria-label={`${label} slider`} />
      <input type="number" min={min} max={max} step={step} value={draft} aria-label={label}
        onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur(); }}
        onBlur={() => {
          const parsed = Number(draft);
          if (draft.trim() && Number.isFinite(parsed)) {
            const next = Math.max(min, Math.min(max, Math.round(parsed / step) * step));
            setDraft(String(next)); onChange(next);
          } else setDraft(String(value));
        }} />
    </div></label>;
}
function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="studio-color"><input type="color" value={value} onChange={(event) => onChange(event.target.value)} /><span>{label}<small>{value.toUpperCase()}</small></span></label>;
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="studio-toggle"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span>{label}</span></label>;
}
function Dialog({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current!; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog className="studio-dialog" ref={ref} aria-label={title} onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <header><div><span className="studio-kicker">Your design journal</span><h2>{title}</h2></div><button className="studio-icon" onClick={onClose} aria-label="Close dialog">x</button></header>{children}
  </dialog>;
}
type Confirmation = { title: string; description: string; label: string; run: () => void };
type Drag = { id: string; startX: number; startY: number; original: Furnishing; preview: Furnishing; pointerId: number };
type Pan = { startX: number; startY: number; x: number; y: number; pointerId: number };
type Tab = 'Objects' | 'Room' | 'Themes' | 'Briefs' | 'Details' | 'Layers';

export default function CafeStudio({ onExit, onApplyDesign }: { onExit: () => void; onApplyDesign: (design: Design) => string | null }) {
  const [restored] = useState(loadStudio);
  const [history, dispatch] = useReducer(historyReducer, { past: [], present: restored.save.current, future: [] });
  const design = history.present;
  const room = design.room;
  const [slots, setSlots] = useState(restored.save.slots);
  const [notice, setNotice] = useState(restored.error);
  const [saveBlocked, setSaveBlocked] = useState(Boolean(restored.error));
  const [saveStatus, setSaveStatus] = useState('Saved on this device');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('Objects');
  const [category, setCategory] = useState<Category>('Seating');
  const [search, setSearch] = useState('');
  const [snap, setSnap] = useState(true);
  const [grid, setGrid] = useState(false);
  const [themeFurniture, setThemeFurniture] = useState(true);
  const [activeBrief, setActiveBrief] = useState('free');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panMode, setPanMode] = useState(false);
  const [drag, setDrag] = useState<Drag | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const panRef = useRef<Pan | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [showSaves, setShowSaves] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [conceptName, setConceptName] = useState('');
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [cleanPreview, setCleanPreview] = useState(false);
  const [showLights, setShowLights] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const selected = design.items.find((item) => item.id === selectedId);
  const stats = designStats(design);
  const checks = briefChecks(design, activeBrief);
  const complete = checks.length > 0 && checks.every((check) => check.done);
  const currentBrief = briefs.find((brief) => brief.id === activeBrief)!;
  const edit = (next: Design) => { dispatch({ type: 'edit', design: next }); };
  const patchRoom = (patch: Partial<Room>) => edit(resizeRoom(design, { ...room, ...patch }));
  const patchItem = (patch: Partial<Furnishing>) => {
    if (!selected) return;
    edit({ ...design, items: design.items.map((item) => item.id === selected.id ? fitItem({ ...item, ...patch }, room) : item) });
  };
  const undo = () => { setDrag(null); dragRef.current = null; dispatch({ type: 'undo' }); };
  const redo = () => { setDrag(null); dragRef.current = null; dispatch({ type: 'redo' }); };

  useEffect(() => {
    if (saveBlocked) { setSaveStatus('Autosave paused'); return; }
    try {
      localStorage.setItem(STUDIO_KEY, JSON.stringify({ version: 1, current: design, slots } satisfies StudioSave));
      setSaveStatus('Saved on this device');
    } catch (error) {
      console.error('Could not save the cafe design studio.', error);
      setSaveStatus('Not saved');
      setNotice('Saving failed. Your browser may have blocked storage or run out of space. Export a backup before leaving.');
    }
  }, [design, slots, saveBlocked]);

  useEffect(() => {
    if (selectedId && !design.items.some((item) => item.id === selectedId)) setSelectedId(null);
  }, [design.items, selectedId]);

  const addItem = (kind: string) => {
    if (design.items.length >= MAX_ITEMS) { setNotice(`This design has reached its ${MAX_ITEMS}-object limit. Remove an object to add another.`); return; }
    const item = fitItem(newItem(kind, crypto.randomUUID(), room.width / 2 + (design.items.length % 5) * 12, room.depth / 2), room, snap);
    edit({ ...design, items: kind === 'rug' ? [item, ...design.items] : [...design.items, item] });
    setSelectedId(item.id);
    setCleanPreview(false);
  };
  const duplicate = () => {
    if (!selected || selected.locked) return;
    if (design.items.length >= MAX_ITEMS) { setNotice(`The ${MAX_ITEMS}-object limit has been reached.`); return; }
    const copy = fitItem({ ...selected, id: crypto.randomUUID(), name: `${selected.name.slice(0, 53)} copy`, x: selected.x + 30, y: selected.y + 30 }, room, snap);
    edit({ ...design, items: [...design.items, copy] }); setSelectedId(copy.id);
  };
  const removeSelected = () => {
    if (!selected || selected.locked) return;
    edit({ ...design, items: design.items.filter((item) => item.id !== selected.id) }); setSelectedId(null);
  };
  const reorder = (direction: -1 | 1) => {
    if (!selected || selected.locked) return;
    const items = [...design.items];
    const index = items.findIndex((item) => item.id === selected.id);
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    edit({ ...design, items });
  };
  const selectItem = (item: Furnishing) => { setSelectedId(item.id); setCleanPreview(false); };
  const point = (event: PointerEvent<SVGElement>) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return null;
    return new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
  };
  const startDrag = (event: PointerEvent<SVGGElement>, item: Furnishing) => {
    if (panMode || cleanPreview || event.button !== 0) return;
    event.stopPropagation();
    svgRef.current?.focus({ preventScroll: true });
    selectItem(item);
    if (item.locked) return;
    const p = point(event);
    if (!p) return;
    svgRef.current?.setPointerCapture(event.pointerId);
    const next = { id: item.id, startX: p.x, startY: p.y, original: item, preview: item, pointerId: event.pointerId };
    dragRef.current = next; setDrag(next);
  };
  const movePointer = (event: PointerEvent<SVGSVGElement>) => {
    const p = point(event);
    if (!p) return;
    const active = dragRef.current;
    if (active && active.pointerId === event.pointerId) {
      const preview = fitItem(moveInScene(active.original, p.x - active.startX, p.y - active.startY, room), room, snap);
      const next = { ...active, preview };
      dragRef.current = next; setDrag(next);
    } else if (panRef.current?.pointerId === event.pointerId) {
      const activePan = panRef.current;
      const rect = svgRef.current!.getBoundingClientRect();
      const scale = Math.min(rect.width / viewWidth, rect.height / viewHeight);
      setPan({ x: activePan.x - (event.clientX - activePan.startX) / scale, y: activePan.y - (event.clientY - activePan.startY) / scale });
    }
  };
  const finishPointer = (event: PointerEvent<SVGSVGElement>, cancel = false) => {
    const active = dragRef.current;
    if (active && active.pointerId === event.pointerId) {
      if (!cancel) edit({ ...design, items: design.items.map((item) => item.id === active.id ? active.preview : item) });
      dragRef.current = null; setDrag(null);
    }
    if (panRef.current?.pointerId === event.pointerId) panRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const stageKeys = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === 'Escape') { setSelectedId(null); setDrag(null); dragRef.current = null; }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault(); if (event.shiftKey) redo(); else undo(); return;
    }
    if (cleanPreview || !selected || selected.locked) return;
    if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); removeSelected(); }
    if (event.key.toLowerCase() === 'r') { event.preventDefault(); patchItem({ rotation: (selected.rotation + 15) % 360 }); }
    const direction = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (direction) {
      event.preventDefault();
      const step = event.shiftKey ? 10 : 1;
      patchItem({ x: selected.x + direction[0] * step, y: selected.y + direction[1] * step });
    }
  };
  const download = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = name;
    link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const fileName = room.name.replace(/[^a-z0-9 -]/gi, '').trim() || 'my-cafe';
  const exportBackup = () => download(new Blob([JSON.stringify({ version: 1, current: design, slots } satisfies StudioSave, null, 2)], { type: 'application/json' }), `${fileName}.json`);
  const exportPicture = () => {
    if (!svgRef.current) return;
    const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
    clone.querySelectorAll('[data-editor]').forEach((element) => element.remove());
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('viewBox', SCENE_VIEWBOX);
    clone.setAttribute('width', String(SCENE_WIDTH)); clone.setAttribute('height', String(SCENE_HEIGHT));
    clone.removeAttribute('tabindex');
    download(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }), `${fileName}.svg`);
  };
  const importFile = async (file: File) => {
    try {
      if (file.size > 2_000_000) throw new Error('Backup exceeds the 2 MB limit.');
      const imported = decodeStudioSave(JSON.parse(await file.text()));
      setConfirmation({
        title: 'Open this backup?', description: 'This replaces the open design and saved concepts. Export your current backup first if you want to keep them.', label: 'Open backup',
        run: () => { edit(imported.current); setSlots(imported.slots); setSelectedId(null); setPan({ x: 0, y: 0 }); setZoom(1); setShowSaves(false); },
      });
    } catch (error) {
      console.error('Could not import cafe design backup.', error);
      setNotice('That backup could not be opened. Use a valid Cafe Design Studio JSON backup, no larger than 2 MB. Your current design has not changed.');
    }
  };
  const loadConcept = (slot: SavedDesign) => setConfirmation({
    title: `Open ${slot.name}?`, description: 'This replaces the open design. You can undo this change, or save the current design as another concept first.', label: 'Open concept',
    run: () => { edit(slot.design); setSelectedId(null); setPan({ x: 0, y: 0 }); setZoom(1); setShowSaves(false); },
  });
  const newConcept = () => {
    if (slots.length >= 6) return;
    setSlots([...slots, { id: crypto.randomUUID(), name: conceptName.trim() || room.name || 'Untitled cafe', design }]);
    setConceptName('');
  };

  const baseWidth = SCENE_WIDTH;
  const baseHeight = SCENE_HEIGHT;
  const viewWidth = baseWidth / zoom;
  const viewHeight = baseHeight / zoom;
  const viewX = (baseWidth - viewWidth) / 2 + pan.x;
  const viewY = (baseHeight - viewHeight) / 2 + pan.y;
  const visibleDesign = drag ? { ...design, items: design.items.map((item) => item.id === drag.id ? drag.preview : item) } : design;
  const selectedPreview = drag?.id === selectedId ? drag.preview : selected;
  const selectionBounds = selectedPreview ? scenePlacement(selectedPreview, visibleDesign) : null;
  const matchingCatalog = catalog.filter((entry) => search.trim()
    ? `${entry.name} ${entry.category}`.toLowerCase().includes(search.trim().toLowerCase()) : entry.category === category);
  const isCeiling = (item: Furnishing) => ['pendant', 'sconce', 'lamp'].includes(furnishingRole(item.kind));
  const openMaterials = () => { setTab('Details'); setExpanded(false); };

  const inspector = selected ? <>
    <div className="studio-selection-heading"><div className="studio-selected-art"><FurnishingArt item={selected} /></div><div><span className="studio-kicker">Every little detail</span><h3>{selected.name}</h3></div></div>
    <div className="studio-object-actions">
      <button onClick={duplicate} disabled={selected.locked || design.items.length >= MAX_ITEMS}>Duplicate</button>
      <button onClick={removeSelected} disabled={selected.locked}>Remove</button>
    </div>
    <Toggle label="Lock object" checked={selected.locked} onChange={(locked) => patchItem({ locked })} />
    <Toggle label="Hide object" checked={selected.hidden} onChange={(hidden) => patchItem({ hidden })} />
    {selected.hidden && <p className="studio-hint">Hidden objects stay in your concept and budget, but do not count toward briefs.</p>}
    {selected.locked && <p className="studio-hint">Unlock to move or edit. You can still select this piece in Layers.</p>}
    <fieldset disabled={selected.locked}>
      <h4>Materials & color</h4>
      <p className="studio-hint">Each piece has its own finish. Material changes the surface texture; use the two colors for upholstery/body and frame/accents.</p>
      <div className="studio-color-pair"><ColorField label="Main finish" value={selected.color} onChange={(color) => patchItem({ color })} /><ColorField label="Accent / frame" value={selected.accent} onChange={(accent) => patchItem({ accent })} /></div>
      <SelectField label="Material" value={selected.material} options={materials} onChange={(material) => patchItem({ material })} />
      <div className="studio-materials" aria-label="Material samples">{materials.map((material) => <button key={material} aria-pressed={selected.material === material} onClick={() => patchItem({ material })}>
        <span><FurnishingArt item={{ ...selected, kind: 'cushion', material, pattern: 'Plain' }} /></span>{material}
      </button>)}</div>
      <SelectField label="Surface pattern" value={selected.pattern} options={patterns} onChange={(pattern) => patchItem({ pattern })} />
      <label className="studio-field"><span>Object name</span><input value={selected.name} maxLength={60} onChange={(event) => patchItem({ name: event.target.value })} /></label>
      <h4>Placement & proportions</h4>
      <NumberField label="Horizontal position" value={selected.x} min={0} max={room.width} unit="cm" onChange={(x) => patchItem({ x })} />
      <NumberField label="Distance from back wall" value={selected.y} min={0} max={room.depth} unit="cm" onChange={(y) => patchItem({ y })} />
      <NumberField label="Width" value={selected.width} min={10} max={350} unit="cm" onChange={(width) => patchItem({ width })} />
      <NumberField label="Depth" value={selected.depth} min={10} max={300} unit="cm" onChange={(depth) => patchItem({ depth })} />
      <NumberField label="Facing direction" value={selected.rotation} min={0} max={360} unit="deg" onChange={(rotation) => patchItem({ rotation })} />
      <p className="studio-hint">Facing changes the visible width and side of the illustration, not its upright angle. Rugs rotate along the floor.</p>
      <SelectField label="Silhouette" value={selected.shape} options={['Rounded', 'Square', 'Round']} onChange={(shape) => patchItem({ shape })} />
      <NumberField label="Decorative detail" value={selected.detail} min={0} max={100} unit="%" onChange={(detail) => patchItem({ detail })} />
      <NumberField label="Opacity" value={selected.opacity} min={15} max={100} unit="%" onChange={(opacity) => patchItem({ opacity })} />
      {isCeiling(selected) && <>
        <h4>This fixture's glow</h4>
        <NumberField label="Fixture brightness" value={selected.lightPower} min={0} max={100} unit="%" onChange={(lightPower) => patchItem({ lightPower })} />
        <NumberField label="Fixture warmth" value={selected.lightWarmth} min={0} max={100} unit="%" onChange={(lightWarmth) => patchItem({ lightWarmth })} />
      </>}
      {['sign', 'menu'].includes(selected.kind) && <>
        <h4>Make it personal</h4>
        <label className="studio-field"><span>Lettering (up to 7 lines)</span><textarea rows={4} maxLength={200} value={selected.text} onChange={(event) => patchItem({ text: event.target.value })} /></label>
        <SelectField label="Lettering style" value={selected.font} options={fonts} onChange={(font) => patchItem({ font })} />
      </>}
      <h4>Layer order</h4>
      <div className="studio-object-actions"><button onClick={() => reorder(-1)} disabled={design.items[0]?.id === selected.id}>Move backward</button><button onClick={() => reorder(1)} disabled={design.items.at(-1)?.id === selected.id}>Move forward</button></div>
      <p className="studio-hint">Place rugs underneath furniture, cups on tables, and equipment on counters. Layer order is manual so you stay in control.</p>
    </fieldset>
  </> : <div className="studio-empty-inspector"><span className="studio-empty-symbol" aria-hidden="true">+</span><h3>A place for every detail.</h3><p>Select a piece in the room or in Layers to make it yours. Every object has its own colors, size, material, and pattern.</p><button onClick={() => setTab('Objects')}>Find something lovely</button></div>;

  const layers = <><div className="studio-panel-title"><h3>Your layers</h3><span>{design.items.length} / {MAX_ITEMS}</span></div>
    <p className="studio-hint">Top of this list = front of the drawing. Select hidden or covered pieces here.</p>
    <div className="studio-layer-list">{[...design.items].reverse().map((item) => <div key={item.id} className={selectedId === item.id ? 'is-selected' : ''}>
      <button className="studio-layer-name" onClick={() => selectItem(item)} aria-pressed={selectedId === item.id}><span>{item.name || 'Unnamed object'}</span><small>{item.locked ? 'Locked' : `${Math.round(item.width)} x ${Math.round(item.depth)} cm`}</small></button>
      <button className="studio-icon" aria-label={`${item.hidden ? 'Show' : 'Hide'} ${item.name}`} onClick={() => edit({ ...design, items: design.items.map((entry) => entry.id === item.id ? { ...entry, hidden: !entry.hidden } : entry) })}>{item.hidden ? '+' : '-'}</button>
    </div>)}</div></>;

  return <main className="design-studio">
    <header className="studio-header">
      <button className="studio-back" onClick={onExit}>Back to games</button>
      <div className="studio-brand"><span className="studio-kicker">Made for Sarah</span><h1>Cafe Design Studio<span>.</span></h1></div>
      <div className="studio-header-actions"><span className="studio-save-status" role="status">{saveStatus}</span><button onClick={() => setShowHelp(true)} aria-label="How to use the design studio">Help</button><button onClick={() => { setConceptName(room.name); setShowSaves(true); }}>My concepts</button><button className="studio-primary" onClick={() => setConfirmation({
        title: 'Make this your Memory Cafe?', description: 'Your current layout, finishes, colors, lettering, and lighting will become the Memory Cafe backdrop. Its interface will coordinate with your palette. Your quiz progress stays intact. Future studio edits only appear after you apply the design again.', label: 'Use this design in Memory Cafe',
        run: () => { const error = onApplyDesign(design); if (error) setNotice(error); },
      })}>Use in Memory Cafe</button></div>
    </header>
    {notice && <div className="studio-notice" role="alert"><p>{notice}</p>{saveBlocked && <button onClick={() => setConfirmation({ title: 'Enable saving?', description: 'This will replace the unreadable stored studio save with the design currently open. Export a backup first if you need to preserve the open design.', label: 'Enable saving', run: () => { setSaveBlocked(false); setNotice(''); } })}>Enable saving</button>}<button aria-label="Dismiss notice" onClick={() => setNotice('')}>x</button></div>}
    <nav className="studio-tabs" aria-label="Design tools">{(['Objects', 'Room', 'Themes', 'Briefs', 'Details', 'Layers'] as Tab[]).map((name) => <button key={name} onClick={() => { setTab(name); setExpanded(false); }} aria-pressed={tab === name}>{name}</button>)}</nav>
    <div className={`studio-workspace ${tab === 'Details' || tab === 'Layers' ? 'studio-workspace--inspector' : ''}${expanded ? ' studio-workspace--expanded' : ''}`}>
      <aside className="studio-library" aria-label="Design library">
        {tab === 'Objects' && <>
          <div className="studio-panel-title"><div><span className="studio-kicker">The collection</span><h2>Find your next detail.</h2></div><span>{catalog.length} pieces</span></div>
          <label className="studio-search"><span className="sr-only">Search furnishings</span><input type="search" placeholder="Search furniture, plants, coffee..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <div className="studio-categories" aria-label="Object categories">{categories.map((name) => <button key={name} aria-pressed={!search && category === name} onClick={() => { setCategory(name); setSearch(''); }}>{name}</button>)}</div>
          <p className="studio-hint">Tap a piece to add it. Drag it into place, then tailor every finish.</p>
          <div className="studio-catalog">{matchingCatalog.map((entry) => <button key={entry.kind} className="studio-catalog-card" onClick={() => addItem(entry.kind)} disabled={design.items.length >= MAX_ITEMS}>
            <span className="studio-catalog-art"><FurnishingArt item={newItem(entry.kind, `catalog-${entry.kind}`, 0, 0)} /></span><strong>{entry.name}</strong><small>${entry.price.toLocaleString()} <span aria-hidden="true">+</span></small>
          </button>)}</div>
          {!matchingCatalog.length && <p className="studio-hint">No matching pieces. Try a different name or category.</p>}
        </>}
        {tab === 'Room' && <>
          <span className="studio-kicker">Start with the shell</span><h2>A room of her own.</h2>
          <label className="studio-field"><span>Cafe name</span><input maxLength={60} value={room.name} onChange={(event) => patchRoom({ name: event.target.value })} /></label>
          <SelectField label="Brand typography" value={room.font} options={fonts} onChange={(font) => patchRoom({ font })} />
          <h4>Room dimensions</h4>
          <NumberField label="Room width" min={400} max={1600} step={10} value={room.width} unit="cm" onChange={(width) => patchRoom({ width })} />
          <NumberField label="Room depth" min={350} max={1200} step={10} value={room.depth} unit="cm" onChange={(depth) => patchRoom({ depth })} />
          <p className="studio-hint">Furniture is kept inside the room when you resize it. Dimensions are concept-plan measurements, not construction drawings.</p>
          <h4>Walls & architectural trim</h4>
          <div className="studio-color-pair"><ColorField label="Wall color" value={room.wall} onChange={(wall) => patchRoom({ wall })} /><ColorField label="Trim color" value={room.trim} onChange={(trim) => patchRoom({ trim })} /></div>
          <SelectField label="Wall finish" value={room.wallStyle} options={wallStyles} onChange={(wallStyle) => patchRoom({ wallStyle })} />
          <NumberField label="Cornice band height" min={30} max={180} value={room.wallHeight} unit="detail units" onChange={(wallHeight) => patchRoom({ wallHeight })} />
          <h4>Underfoot</h4>
          <SelectField label="Floor pattern" value={room.floorStyle} options={floorStyles} onChange={(floorStyle) => patchRoom({ floorStyle })} />
          <div className="studio-color-pair"><ColorField label="Floor base" value={room.floor} onChange={(floor) => patchRoom({ floor })} /><ColorField label="Grout / inlay" value={room.floorAccent} onChange={(floorAccent) => patchRoom({ floorAccent })} /></div>
          <NumberField label="Floor pattern scale" min={20} max={120} value={room.floorScale} unit="cm" onChange={(floorScale) => patchRoom({ floorScale })} />
          <h4>Set the mood</h4>
          <Toggle label="Evening atmosphere" checked={room.night} onChange={(night) => patchRoom({ night })} />
          <NumberField label="Ambient brightness" min={0} max={100} value={room.light} unit="%" onChange={(light) => patchRoom({ light })} />
          <NumberField label="Light warmth" min={0} max={100} value={room.warmth} unit="%" onChange={(warmth) => patchRoom({ warmth })} />
          <h4>The street-side welcome</h4>
          <div className="studio-color-pair"><ColorField label="Facade" value={room.facade} onChange={(facade) => patchRoom({ facade })} /><ColorField label="Awning fabric" value={room.awning} onChange={(awning) => patchRoom({ awning })} /></div>
          <SelectField label="Awning style" value={room.awningStyle} options={['Striped', 'Solid', 'None']} onChange={(awningStyle) => patchRoom({ awningStyle })} />
          <p className="studio-hint">The awning and brand colors appear across the top of your interior. Place windows, doors, and wall decor near the back wall. Outdoor pieces can create an indoor-outdoor terrace concept.</p>
        </>}
        {tab === 'Themes' && <>
          <span className="studio-kicker">A starting point, never a rule</span><h2>What's your kind of cozy?</h2>
          <p className="studio-intro">Choose a palette, then change absolutely every finish yourself. Themes preserve your layout.</p>
          <Toggle label="Also coordinate furniture accents & upholstery" checked={themeFurniture} onChange={setThemeFurniture} />
          <div className="studio-themes">{themes.map((theme) => <button key={theme.name} onClick={() => edit(applyTheme(design, theme, themeFurniture))}>
            <span className="studio-swatches">{[theme.wall, theme.floor, theme.accent, theme.upholstery].map((color, i) => <i key={i} style={{ background: color }} />)}</span><strong>{theme.name}</strong><small>{theme.description}</small>
          </button>)}</div><p className="studio-hint">Your custom theme is simply your design: mix any colors and materials, then save it as a named concept. Undo restores a previous palette.</p>
        </>}
        {tab === 'Briefs' && <>
          <span className="studio-kicker">Play at your own pace</span><h2>A little inspiration.</h2>
          <p className="studio-intro">No countdowns. No taste scores. Just little design briefs to make your own.</p>
          <div className="studio-briefs">{briefs.map((brief) => <button key={brief.id} aria-pressed={activeBrief === brief.id} onClick={() => setActiveBrief(brief.id)}><strong>{brief.name}</strong><small>{brief.description}</small></button>)}</div>
          {checks.length > 0 && <div className="studio-checks"><h3>{complete ? 'Brief complete. Beautifully yours.' : 'Your design checklist'}</h3>{checks.map((check) => <p key={check.label} className={check.done ? 'is-done' : ''}><span aria-hidden="true">{check.done ? '[x]' : '[ ]'}</span>{check.label}</p>)}</div>}
          <p className="studio-hint">Prices are fictional, fixed per catalog piece. Resizing does not change price. Hidden objects still cost money. Seat counts estimate one place per 55 cm of sofa or banquette.</p>
        </>}
        {(tab === 'Details' || tab === 'Layers') && <div className="studio-desktop-tip"><span className="studio-kicker">Your personal atelier</span><h2>Small details.<br />Big feelings.</h2><p>Select an object and make it your own in the inspector.</p><button onClick={() => setTab('Objects')}>Back to the collection</button></div>}
      </aside>

      <section className="studio-drawing" aria-label="Cafe design canvas">
        <div className="studio-drawing-heading"><div><span className="studio-kicker">Your cafe / front-facing interior</span><h2>{room.name || 'Untitled cafe'}</h2></div><span className="studio-plan-badge">{room.night ? 'Evening' : 'Daylight'}</span></div>
        <div className="studio-toolbar" aria-label="Canvas tools">
          <div><button onClick={undo} disabled={!history.past.length || Boolean(drag)}>Undo</button><button onClick={redo} disabled={!history.future.length || Boolean(drag)}>Redo</button></div>
          <div><button aria-pressed={panMode} onClick={() => setPanMode(!panMode)}>Pan</button><button aria-pressed={grid} onClick={() => setGrid(!grid)}>Grid</button><button aria-pressed={snap} onClick={() => setSnap(!snap)}>Snap 10 cm</button></div>
          <div><button aria-pressed={cleanPreview} onClick={() => setCleanPreview(!cleanPreview)}>Preview</button><button aria-pressed={showLights} onClick={() => setShowLights(!showLights)}>Lights layer</button><button aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Show panels' : 'Expand canvas'}</button></div>
        </div>
        <div className={`studio-stage${panMode ? ' studio-stage--pan' : ''}`}>
          <svg ref={svgRef} viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`} tabIndex={0} role="group" aria-label="Editable front-facing cafe interior. Select objects using Layers or click a piece. Arrow keys move the selected object, R changes its facing direction, Delete removes."
            onKeyDown={stageKeys} onPointerDown={(event) => {
              if (event.button !== 0 || dragRef.current) return;
              if (panMode) {
                event.currentTarget.setPointerCapture(event.pointerId);
                panRef.current = { startX: event.clientX, startY: event.clientY, x: pan.x, y: pan.y, pointerId: event.pointerId };
              } else setSelectedId(null);
            }} onPointerMove={movePointer} onPointerUp={(event) => finishPointer(event)} onPointerCancel={(event) => finishPointer(event, true)}
            onLostPointerCapture={() => { dragRef.current = null; setDrag(null); panRef.current = null; }}>
            <title>{room.name} - cafe design concept</title>
            <RoomArtwork design={visibleDesign} grid={grid && !cleanPreview} />
            {visibleDesign.items.filter((item) => !item.hidden && (showLights || !isCeiling(item))).map((item) => <g key={item.id}
              onPointerDown={(event) => startDrag(event, item)} style={{ cursor: cleanPreview ? 'default' : panMode ? 'grab' : item.locked ? 'not-allowed' : 'move' }}>
              <title>{item.name}{item.locked ? ' (locked)' : ''}</title>
              <PlacedFurnishing item={item} design={visibleDesign} />
            </g>)}
            <RoomAtmosphere room={room} />
            {!cleanPreview && selectedPreview && selectionBounds && !selectedPreview.hidden && (showLights || !isCeiling(selectedPreview)) && <g data-editor="true" pointerEvents="none" transform={`translate(${selectionBounds.x} ${selectionBounds.y})`}>
              {selectedPreview.kind === 'rug' ? <ellipse rx={Math.max(selectionBounds.width, selectedPreview.depth * selectionBounds.scale) / 2 + 8} ry={Math.max(selectionBounds.width, selectedPreview.depth * selectionBounds.scale) * .18 + 5} fill="none" stroke="#31594f" strokeWidth="2" strokeDasharray="5 4" />
                : <rect x={-selectionBounds.width / 2 - 5} y={-selectionBounds.height - 5} width={selectionBounds.width + 10} height={selectionBounds.height + 10} rx="4" fill="none" stroke="#31594f" strokeWidth="2" strokeDasharray={selectedPreview.locked ? '5 4' : undefined} vectorEffect="non-scaling-stroke" />}
              <circle r="5" fill="#fff9e8" stroke="#31594f" strokeWidth="2" />
            </g>}
          </svg>
          <div className="studio-zoom"><button onClick={() => setZoom(Math.max(.5, Math.round((zoom - .25) * 100) / 100))} disabled={zoom <= .5} aria-label="Zoom out">-</button><output aria-label="Zoom level">{Math.round(zoom * 100)}%</output><button onClick={() => setZoom(Math.min(3, zoom + .25))} disabled={zoom >= 3} aria-label="Zoom in">+</button><button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>Fit</button></div>
          {cleanPreview && <span className="studio-preview-label">Preview mode - turn off to edit</span>}
        </div>
        <div className="studio-canvas-footer"><span>{panMode ? 'Drag the canvas to explore.' : selected ? `${selected.name} selected. Drag to move; edit in Details.` : 'A blank corner is a new possibility. Select a piece to begin.'}</span>{selected && <button className="studio-primary" onClick={openMaterials}>Edit materials</button>}<button onClick={exportPicture}>Export picture</button></div>
        <div className="studio-stats"><div><strong>{stats.area}</strong><span>square meters</span></div><div><strong>{stats.seats}</strong><span>guest seats</span></div><div><strong>${stats.cost.toLocaleString()}</strong><span>concept cost</span></div><div><strong>{design.items.length}</strong><span>little details</span></div></div>
        <div className={`studio-active-brief${complete ? ' is-complete' : ''}`} role="status"><span className="studio-kicker">{complete ? 'Brief complete' : 'Currently creating'}</span><strong>{currentBrief.name}</strong>{checks.length ? <span>{checks.filter((check) => check.done).length} / {checks.length} goals met</span> : <span>Unlimited imagination. Always.</span>}</div>
      </section>

      <aside className={`studio-inspector ${tab === 'Layers' ? 'studio-inspector--layers' : ''}`} aria-label="Object details and layers">
        <div className="studio-inspector-tabs"><button aria-pressed={tab !== 'Layers'} onClick={() => setTab('Details')}>Details</button><button aria-pressed={tab === 'Layers'} onClick={() => setTab('Layers')}>Layers ({design.items.length})</button></div>
        {tab === 'Layers' ? layers : inspector}
      </aside>
    </div>
    <footer className="studio-bottom"><span>A little place for your very big imagination, Sarah.</span><button onClick={() => setConfirmation({
      title: 'Start a fresh canvas?', description: 'Choose an empty room or the furnished starter. Save your current design as a concept first. You can also undo this change.', label: 'Empty room',
      run: () => { edit({ room: createDesign().room, items: [] }); setSelectedId(null); setPan({ x: 0, y: 0 }); setZoom(1); },
    })}>New empty room</button><button onClick={() => setConfirmation({ title: 'Restore the starter?', description: 'This replaces the open design with the original furnished cafe. Saved concepts stay intact, and you can undo.', label: 'Restore starter', run: () => { edit(createDesign()); setSelectedId(null); setPan({ x: 0, y: 0 }); setZoom(1); } })}>Furnished starter</button></footer>

    {showSaves && !confirmation && <Dialog title="Your little collection" onClose={() => setShowSaves(false)}>
      <p className="studio-intro">The open design autosaves on this browser. Keep up to six named concepts here, and export a backup to take them to another device.</p>
      <label className="studio-field"><span>New concept name</span><input maxLength={60} value={conceptName} onChange={(event) => setConceptName(event.target.value)} /></label>
      <button className="studio-primary" onClick={newConcept} disabled={slots.length >= 6}>Save as a new concept ({slots.length}/6)</button>
      {slots.length >= 6 && <p className="studio-hint">Your journal is full. Replace or delete a concept, or export a backup first.</p>}
      <div className="studio-saved-list">{slots.map((slot) => <article key={slot.id}><div className="studio-saved-swatch" style={{ background: slot.design.room.floor, borderColor: slot.design.room.wall }} /><div><h3>{slot.name}</h3><small>{slot.design.items.length} objects / {designStats(slot.design).area} m2</small><div className="studio-object-actions"><button onClick={() => loadConcept(slot)}>Open</button><button onClick={() => setConfirmation({ title: `Replace ${slot.name}?`, description: 'The current design will replace this saved concept. Other concepts stay unchanged.', label: 'Replace concept', run: () => setSlots(slots.map((entry) => entry.id === slot.id ? { ...entry, name: conceptName.trim() || room.name || entry.name, design } : entry)) })}>Replace</button><button onClick={() => setConfirmation({ title: `Delete ${slot.name}?`, description: 'This removes the named concept, not your open design. This action cannot be undone. Export a backup if you want to keep a copy.', label: 'Delete concept', run: () => setSlots(slots.filter((entry) => entry.id !== slot.id)) })}>Delete</button></div></div></article>)}</div>
      <h4>Keep it forever</h4><div className="studio-object-actions"><button onClick={exportBackup}>Export JSON backup</button><button onClick={() => fileRef.current?.click()}>Import JSON backup</button><button onClick={exportPicture}>Export SVG picture</button></div>
      <p className="studio-hint">Backups include the open design and all concepts. SVG pictures can be opened in a browser or design software. Browser storage can be cleared; a downloaded backup is your safest copy.</p>
    </Dialog>}
    <input className="studio-file-input" type="file" accept=".json,application/json" ref={fileRef} aria-label="Import studio backup" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importFile(file); event.target.value = ''; }} />
    {showHelp && <Dialog title="Welcome to your atelier" onClose={() => setShowHelp(false)}>
      <div className="studio-help"><p><strong>1. Make a mood.</strong> Start with a theme or create your own palette in Room. Themes keep your layout and can be undone.</p>
        <p><strong>2. Fill it with lovely things.</strong> Tap objects in the collection, drag them into place, and open Details to change dimensions, rotation, colors, materials, patterns, and lettering.</p>
        <p><strong>3. Layer the little details.</strong> Add cups on tables, equipment on counters, and cushions on sofas. Use Layers to find covered pieces; move objects forward or backward in Details. Lock finished pieces.</p>
        <p><strong>4. See the whole picture.</strong> The room faces you, with upright furniture and a receding floor. Drag up to move deeper into the room and down to bring pieces forward. Turn off the Lights layer to work underneath ceiling fixtures. Expand canvas hides the panels; choose a tool tab to bring them back. Use Preview for a clean view, and Pan or zoom to explore.</p>
        <p><strong>5. Play or just create.</strong> Briefs offer optional measurable goals. There is no timer, and free design has no budget restriction.</p>
        <p><strong>6. Keep your favorites.</strong> My concepts holds six designs. Export JSON for an editable backup, or SVG for a picture. Saves stay on this browser, not in an online account.</p>
        <p><strong>7. Play inside your design.</strong> Use in Memory Cafe publishes a snapshot of this room and opens the quiz with your layout and a matching interface palette. Reapply after editing to update it. In Memory Cafe, switch between My design and Original cafe without losing progress.</p>
        <h3>Keyboard, without dragging</h3><p>Select a piece in Layers, then focus the drawing: arrow keys move 1 cm, Shift + arrows move 10 cm, R rotates 15 degrees, Delete removes, and Escape deselects. Ctrl / Command + Z undoes; add Shift to redo. All measurements can also be typed in Details.</p>
        <p className="studio-hint">This is an illustrated front-facing concept designer, not a 3D renderer, lighting simulation, accessibility assessment, or construction tool. Facing direction narrows and mirrors illustrations rather than rotating a 3D model. Overlap is allowed for layered styling. Outdoor pieces can be arranged as a terrace concept.</p></div>
    </Dialog>}
    {confirmation && <Dialog title={confirmation.title} onClose={() => setConfirmation(null)}><p className="studio-intro">{confirmation.description}</p><div className="studio-object-actions"><button onClick={() => setConfirmation(null)}>Cancel</button><button className="studio-primary" onClick={() => { confirmation.run(); setConfirmation(null); }}>{confirmation.label}</button></div></Dialog>}
  </main>;
}
