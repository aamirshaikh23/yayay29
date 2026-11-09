export const STUDIO_KEY = 'sarah-cafe-studio-v1';
export const MEMORY_DESIGN_KEY = 'sarah-memory-cafe-design-v1';
export interface MemoryDesignSetting { version: 1; enabled: boolean; design: Design }
export const MAX_ITEMS = 150;
export const categories = ['Seating', 'Tables', 'Coffee bar', 'Architecture', 'Lighting', 'Decor', 'Outdoor'] as const;
export type Category = typeof categories[number];
export const materials = ['Oak', 'Walnut', 'Marble', 'Terrazzo', 'Metal', 'Velvet', 'Linen', 'Rattan', 'Leather', 'Boucle', 'Brass', 'Chrome', 'Ceramic', 'Concrete', 'Glass', 'Cork'] as const;
export type Material = typeof materials[number];
export const patterns = ['Plain', 'Stripes', 'Checks', 'Dots'] as const;
export type Pattern = typeof patterns[number];
export const floorStyles = ['Planks', 'Herringbone', 'Tiles', 'Checkerboard', 'Terrazzo', 'Plain'] as const;
export const wallStyles = ['Paint', 'Paneling', 'Stripes', 'Brick'] as const;
export const fonts = ['sans-serif', 'serif', 'monospace', 'cursive'] as const;

export interface CatalogItem {
  kind: string;
  name: string;
  category: Category;
  width: number;
  depth: number;
  price: number;
  color: string;
  accent: string;
  material: Material;
}

export const catalog: CatalogItem[] = [
  { kind: 'chair', name: 'Dining chair', category: 'Seating', width: 48, depth: 48, price: 140, color: '#b5c3a3', accent: '#896345', material: 'Linen' },
  { kind: 'armchair', name: 'Lounge chair', category: 'Seating', width: 80, depth: 80, price: 390, color: '#ce9e89', accent: '#785541', material: 'Velvet' },
  { kind: 'stool', name: 'Bar stool', category: 'Seating', width: 38, depth: 38, price: 110, color: '#cfb38a', accent: '#65544a', material: 'Rattan' },
  { kind: 'sofa', name: 'Two-seat sofa', category: 'Seating', width: 155, depth: 80, price: 780, color: '#a5b49b', accent: '#6b5140', material: 'Velvet' },
  { kind: 'bench', name: 'Banquette', category: 'Seating', width: 180, depth: 60, price: 650, color: '#b68973', accent: '#886349', material: 'Linen' },
  { kind: 'table', name: 'Bistro table', category: 'Tables', width: 80, depth: 80, price: 240, color: '#e8d9bf', accent: '#8b715a', material: 'Marble' },
  { kind: 'dining', name: 'Communal table', category: 'Tables', width: 190, depth: 85, price: 620, color: '#b98a5e', accent: '#775843', material: 'Oak' },
  { kind: 'side', name: 'Side table', category: 'Tables', width: 45, depth: 45, price: 120, color: '#d6b590', accent: '#775843', material: 'Oak' },
  { kind: 'counter', name: 'Service counter', category: 'Coffee bar', width: 220, depth: 70, price: 1400, color: '#d8d1bb', accent: '#80957c', material: 'Marble' },
  { kind: 'cabinet', name: 'Storage cabinet', category: 'Coffee bar', width: 110, depth: 50, price: 480, color: '#b68c64', accent: '#ddc49b', material: 'Oak' },
  { kind: 'machine', name: 'Espresso machine', category: 'Coffee bar', width: 65, depth: 40, price: 1600, color: '#b9c3bd', accent: '#6a6c64', material: 'Metal' },
  { kind: 'grinder', name: 'Coffee grinder', category: 'Coffee bar', width: 25, depth: 30, price: 280, color: '#65736c', accent: '#b58758', material: 'Metal' },
  { kind: 'display', name: 'Pastry display', category: 'Coffee bar', width: 90, depth: 50, price: 850, color: '#c4ddd5', accent: '#9b795a', material: 'Metal' },
  { kind: 'sink', name: 'Bar sink', category: 'Coffee bar', width: 50, depth: 40, price: 260, color: '#c0c6c3', accent: '#71817d', material: 'Metal' },
  { kind: 'fridge', name: 'Under-counter fridge', category: 'Coffee bar', width: 60, depth: 60, price: 650, color: '#d7dfd8', accent: '#63776b', material: 'Metal' },
  { kind: 'shelf', name: 'Display shelving', category: 'Coffee bar', width: 120, depth: 35, price: 320, color: '#b58d68', accent: '#f0dbc1', material: 'Walnut' },
  { kind: 'door', name: 'Entrance door', category: 'Architecture', width: 90, depth: 20, price: 650, color: '#8caa96', accent: '#e7dabf', material: 'Oak' },
  { kind: 'window', name: 'Window & curtains', category: 'Architecture', width: 160, depth: 22, price: 580, color: '#c6e0d9', accent: '#dbc9b0', material: 'Linen' },
  { kind: 'partition', name: 'Slatted divider', category: 'Architecture', width: 140, depth: 20, price: 380, color: '#ac8059', accent: '#d9bd94', material: 'Oak' },
  { kind: 'pendant', name: 'Pendant light', category: 'Lighting', width: 45, depth: 45, price: 180, color: '#e6bf77', accent: '#6c6552', material: 'Rattan' },
  { kind: 'sconce', name: 'Wall sconce', category: 'Lighting', width: 28, depth: 28, price: 95, color: '#e9d39f', accent: '#947850', material: 'Metal' },
  { kind: 'lamp', name: 'Floor lamp', category: 'Lighting', width: 42, depth: 42, price: 190, color: '#e8d8ba', accent: '#806344', material: 'Linen' },
  { kind: 'rug', name: 'Area rug', category: 'Decor', width: 210, depth: 150, price: 260, color: '#d5a48b', accent: '#f1dfba', material: 'Linen' },
  { kind: 'plant', name: 'Potted greenery', category: 'Decor', width: 65, depth: 65, price: 75, color: '#789773', accent: '#bc8b6c', material: 'Rattan' },
  { kind: 'vase', name: 'Flowers & vase', category: 'Decor', width: 28, depth: 28, price: 35, color: '#dca8b1', accent: '#e0cfac', material: 'Marble' },
  { kind: 'art', name: 'Framed artwork', category: 'Decor', width: 70, depth: 45, price: 140, color: '#b5bca0', accent: '#a57853', material: 'Oak' },
  { kind: 'mirror', name: 'Statement mirror', category: 'Decor', width: 70, depth: 40, price: 180, color: '#cbdcdb', accent: '#b8955e', material: 'Metal' },
  { kind: 'books', name: 'Books & magazines', category: 'Decor', width: 32, depth: 25, price: 25, color: '#ad7a65', accent: '#ebd6b2', material: 'Linen' },
  { kind: 'cups', name: 'Cup & saucer', category: 'Decor', width: 22, depth: 22, price: 15, color: '#f6eddb', accent: '#845e43', material: 'Marble' },
  { kind: 'cushion', name: 'Scatter cushion', category: 'Decor', width: 32, depth: 32, price: 30, color: '#d6af72', accent: '#f0debd', material: 'Velvet' },
  { kind: 'clock', name: 'Wall clock', category: 'Decor', width: 35, depth: 35, price: 65, color: '#f4e4c4', accent: '#7a6450', material: 'Oak' },
  { kind: 'menu', name: 'Menu board', category: 'Decor', width: 75, depth: 55, price: 95, color: '#41574b', accent: '#d8ba8d', material: 'Oak' },
  { kind: 'sign', name: 'Custom lettering', category: 'Decor', width: 150, depth: 40, price: 160, color: '#e3b18d', accent: '#695343', material: 'Metal' },
  { kind: 'umbrella', name: 'Terrace parasol', category: 'Outdoor', width: 155, depth: 155, price: 290, color: '#dcc6a0', accent: '#91a38d', material: 'Linen' },
  { kind: 'outdoor', name: 'Terrace table', category: 'Outdoor', width: 75, depth: 75, price: 210, color: '#91a38d', accent: '#e5d6b9', material: 'Metal' },
  { kind: 'planter', name: 'Long planter', category: 'Outdoor', width: 120, depth: 35, price: 120, color: '#78936c', accent: '#ba8b64', material: 'Oak' },
  { kind: 'bentwood', name: 'Bentwood cafe chair', category: 'Seating', width: 46, depth: 48, price: 175, color: '#bc9367', accent: '#77563f', material: 'Walnut' },
  { kind: 'canechair', name: 'Cane-back chair', category: 'Seating', width: 52, depth: 52, price: 220, color: '#d8bc88', accent: '#936e4e', material: 'Rattan' },
  { kind: 'tubchair', name: 'Curved accent chair', category: 'Seating', width: 85, depth: 78, price: 440, color: '#e1d3bb', accent: '#a18d70', material: 'Boucle' },
  { kind: 'ottoman', name: 'Round pouf', category: 'Seating', width: 60, depth: 60, price: 160, color: '#c69976', accent: '#886046', material: 'Leather' },
  { kind: 'coffeetable', name: 'Low coffee table', category: 'Tables', width: 120, depth: 65, price: 320, color: '#c6a381', accent: '#765e49', material: 'Oak' },
  { kind: 'kettle', name: 'Gooseneck kettle', category: 'Coffee bar', width: 28, depth: 24, price: 95, color: '#c4a26a', accent: '#746047', material: 'Brass' },
  { kind: 'dripper', name: 'Pour-over station', category: 'Coffee bar', width: 30, depth: 28, price: 80, color: '#e3d3b7', accent: '#966a4d', material: 'Ceramic' },
  { kind: 'toaster', name: 'Countertop toaster', category: 'Coffee bar', width: 38, depth: 30, price: 140, color: '#b5c2b5', accent: '#6e7c6d', material: 'Chrome' },
  { kind: 'tray', name: 'Serving tray', category: 'Decor', width: 40, depth: 30, price: 28, color: '#b89164', accent: '#805e3e', material: 'Cork' },
  { kind: 'candle', name: 'Sculptural candle', category: 'Decor', width: 18, depth: 18, price: 24, color: '#ead1a0', accent: '#ae8a5a', material: 'Ceramic' },
  { kind: 'sculpture', name: 'Abstract ceramic sculpture', category: 'Decor', width: 35, depth: 25, price: 90, color: '#d8bb9b', accent: '#a18061', material: 'Ceramic' },
  { kind: 'basket', name: 'Woven storage basket', category: 'Decor', width: 45, depth: 40, price: 45, color: '#c6a16c', accent: '#947044', material: 'Rattan' },
  { kind: 'recordplayer', name: 'Record player', category: 'Decor', width: 48, depth: 35, price: 220, color: '#b48766', accent: '#59483c', material: 'Walnut' },
  { kind: 'tablelamp', name: 'Mushroom table lamp', category: 'Lighting', width: 32, depth: 32, price: 110, color: '#cc9a7e', accent: '#a17658', material: 'Ceramic' },
];

export interface Furnishing {
  id: string;
  kind: string;
  name: string;
  x: number;
  y: number;
  width: number;
  depth: number;
  rotation: number;
  color: string;
  accent: string;
  material: Material;
  pattern: Pattern;
  shape: 'Rounded' | 'Square' | 'Round';
  text: string;
  font: typeof fonts[number];
  detail: number;
  lightPower: number;
  lightWarmth: number;
  opacity: number;
  locked: boolean;
  hidden: boolean;
}

export function furnishingRole(kind: string): string {
  const roles: Record<string, string> = {
    bentwood: 'chair', canechair: 'chair', tubchair: 'armchair', ottoman: 'stool',
    coffeetable: 'side', tablelamp: 'lamp',
  };
  return roles[kind] ?? kind;
}

export interface Room {
  name: string;
  width: number;
  depth: number;
  wall: string;
  trim: string;
  floor: string;
  floorAccent: string;
  floorStyle: typeof floorStyles[number];
  wallStyle: typeof wallStyles[number];
  wallHeight: number;
  floorScale: number;
  light: number;
  warmth: number;
  night: boolean;
  facade: string;
  awning: string;
  awningStyle: 'Striped' | 'Solid' | 'None';
  font: typeof fonts[number];
}
export interface Design { room: Room; items: Furnishing[] }
export interface SavedDesign { id: string; name: string; design: Design }
export interface StudioSave { version: 1; current: Design; slots: SavedDesign[] }
export interface Theme { name: string; description: string; wall: string; trim: string; floor: string; accent: string; upholstery: string; floorStyle: Room['floorStyle'] }
export const themes: Theme[] = [
  { name: 'Slow Sunday', description: 'Warm oak, soft sage, a little sunshine.', wall: '#efe8d8', trim: '#a78c6e', floor: '#c5a17c', accent: '#70886e', upholstery: '#b6c2a3', floorStyle: 'Planks' },
  { name: 'Parisian', description: 'Cream marble and rose-colored afternoons.', wall: '#f3e4da', trim: '#b79b79', floor: '#e8dec9', accent: '#704d50', upholstery: '#c98e98', floorStyle: 'Checkerboard' },
  { name: 'Japandi', description: 'Quiet lines, natural textures, room to breathe.', wall: '#e9e5d9', trim: '#8c8069', floor: '#cdbb9c', accent: '#565e4d', upholstery: '#bbbda5', floorStyle: 'Herringbone' },
  { name: 'Botanical', description: 'A green escape for coffee and daydreams.', wall: '#d9e3ce', trim: '#728264', floor: '#c0a184', accent: '#3e684c', upholstery: '#91ac7e', floorStyle: 'Tiles' },
  { name: 'Industrial', description: 'Brick, dark metal, and honest materials.', wall: '#bb8d73', trim: '#514d47', floor: '#a6a39b', accent: '#414c4b', upholstery: '#a87950', floorStyle: 'Plain' },
  { name: 'Coastal', description: 'Sea glass, linen, and salt-air blues.', wall: '#edf0e3', trim: '#9dbaa9', floor: '#d9c8a9', accent: '#508f99', upholstery: '#abd0cd', floorStyle: 'Planks' },
  { name: 'Vintage', description: 'Honey wood and collected little treasures.', wall: '#e9d8ae', trim: '#8a6550', floor: '#ad8059', accent: '#8f6249', upholstery: '#be9857', floorStyle: 'Terrazzo' },
];

export function newItem(kind: string, id: string, x: number, y: number): Furnishing {
  const entry = catalog.find((item) => item.kind === kind);
  if (!entry) throw new Error(`Unknown furnishing: ${kind}`);
  return {
    id, kind, name: entry.name, x, y, width: entry.width, depth: entry.depth, rotation: 0,
    color: entry.color, accent: entry.accent, material: entry.material, pattern: 'Plain',
    shape: ['table', 'side', 'stool', 'outdoor', 'plant', 'pendant', 'clock', 'umbrella', 'cups', 'vase'].includes(kind) ? 'Round' : 'Rounded',
    text: kind === 'menu' ? 'COFFEE\nEspresso  3\nLatte  4\nMatcha  4\nMade with love' : kind === 'sign' ? 'stay a little' : '',
    font: 'serif', detail: 55, lightPower: 70, lightWarmth: 65, opacity: 100, locked: false, hidden: false,
  };
}

export function createDesign(): Design {
  const theme = themes[0];
  const room: Room = {
    name: "Sarah's little cafe", width: 900, depth: 640, wall: theme.wall, trim: theme.trim,
    floor: theme.floor, floorAccent: '#e8d6b8', floorStyle: theme.floorStyle, wallStyle: 'Paneling',
    wallHeight: 90, floorScale: 60, light: 85, warmth: 35, night: false,
    facade: '#92a48a', awning: '#f4e7ca', awningStyle: 'Striped', font: 'serif',
  };
  const placements: [string, number, number][] = [
    ['rug', 590, 360], ['counter', 240, 110], ['machine', 200, 105], ['grinder', 270, 105],
    ['display', 390, 105], ['shelf', 240, 30], ['window', 650, 16],
    ['bench', 680, 125], ['table', 650, 235], ['chair', 650, 315],
    ['table', 270, 380], ['chair', 270, 300], ['chair', 270, 460],
    ['sofa', 680, 480], ['side', 560, 480], ['plant', 815, 80], ['plant', 80, 550],
    ['pendant', 270, 380], ['cups', 650, 235], ['vase', 560, 480], ['door', 500, 20],
  ];
  return { room, items: placements.map(([kind, x, y], i) => newItem(kind, `starter-${i}`, x, y)) };
}

export function fitItem(item: Furnishing, room: Room, snap = false): Furnishing {
  const angle = item.rotation * Math.PI / 180;
  const boundsWidth = Math.abs(Math.cos(angle)) * item.width + Math.abs(Math.sin(angle)) * item.depth;
  const boundsDepth = Math.abs(Math.sin(angle)) * item.width + Math.abs(Math.cos(angle)) * item.depth;
  const scale = Math.min(1, room.width / boundsWidth, room.depth / boundsDepth);
  const dx = boundsWidth * scale / 2;
  const dy = boundsDepth * scale / 2;
  const x = snap ? Math.round(item.x / 10) * 10 : item.x;
  const y = snap ? Math.round(item.y / 10) * 10 : item.y;
  return { ...item, width: item.width * scale, depth: item.depth * scale, x: Math.max(dx, Math.min(room.width - dx, x)), y: Math.max(dy, Math.min(room.depth - dy, y)) };
}

export function resizeRoom(design: Design, room: Room): Design {
  return { room, items: design.items.map((item) => fitItem(item, room)) };
}

export function applyTheme(design: Design, theme: Theme, furniture: boolean): Design {
  return {
    room: { ...design.room, wall: theme.wall, floor: theme.floor, trim: theme.trim, floorStyle: theme.floorStyle, facade: theme.accent,
      wallStyle: theme.name === 'Industrial' ? 'Brick' : theme.name === 'Parisian' ? 'Paneling' : 'Paint' },
    items: furniture ? design.items.map((item) => ({
      ...item, color: catalog.find((entry) => entry.kind === item.kind)?.category === 'Seating' ? theme.upholstery : item.color,
      accent: theme.accent,
    })) : design.items,
  };
}

export interface History { past: Design[]; present: Design; future: Design[] }
export type HistoryAction = { type: 'edit'; design: Design } | { type: 'undo' } | { type: 'redo' };
export function historyReducer(state: History, action: HistoryAction): History {
  if (action.type === 'undo') {
    const previous = state.past.at(-1);
    return previous ? { past: state.past.slice(0, -1), present: previous, future: [state.present, ...state.future] } : state;
  }
  if (action.type === 'redo') {
    const next = state.future[0];
    return next ? { past: [...state.past, state.present].slice(-50), present: next, future: state.future.slice(1) } : state;
  }
  if (JSON.stringify(state.present) === JSON.stringify(action.design)) return state;
  return { past: [...state.past, state.present].slice(-50), present: action.design, future: [] };
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid saved design object.');
  return value as Record<string, unknown>;
}
function string(value: unknown, max = 100): string {
  if (typeof value !== 'string' || value.length > max) throw new Error('Invalid saved text.');
  return value;
}
function color(value: unknown): string {
  const text = string(value);
  if (!/^#[0-9a-f]{6}$/i.test(text)) throw new Error('Invalid saved color.');
  return text;
}
function number(value: unknown, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new Error('Invalid saved measurement.');
  return value;
}
function boolean(value: unknown): boolean {
  if (typeof value !== 'boolean') throw new Error('Invalid saved setting.');
  return value;
}
function option<T extends string>(value: unknown, options: readonly T[]): T {
  const found = options.find((entry) => entry === value);
  if (!found) throw new Error('Unknown saved option.');
  return found;
}
export function decodeDesign(value: unknown): Design {
  const data = record(value);
  const r = record(data.room);
  const room: Room = {
    name: string(r.name, 60), width: number(r.width, 400, 1600), depth: number(r.depth, 350, 1200),
    wall: color(r.wall), trim: color(r.trim), floor: color(r.floor), floorAccent: color(r.floorAccent),
    floorStyle: option(r.floorStyle, floorStyles), wallStyle: option(r.wallStyle, wallStyles),
    wallHeight: number(r.wallHeight, 30, 180), floorScale: number(r.floorScale, 20, 120),
    light: number(r.light, 0, 100), warmth: number(r.warmth, 0, 100), night: boolean(r.night),
    facade: color(r.facade), awning: color(r.awning), awningStyle: option(r.awningStyle, ['Striped', 'Solid', 'None']),
    font: option(r.font, fonts),
  };
  if (!Array.isArray(data.items) || data.items.length > MAX_ITEMS) throw new Error('Too many saved furnishings.');
  const ids = new Set<string>();
  const items = data.items.map((value): Furnishing => {
    const item = record(value);
    const id = string(item.id);
    if (!id || ids.has(id)) throw new Error('Duplicate or missing furnishing ID.');
    ids.add(id);
    return {
      id, kind: option(item.kind, catalog.map((entry) => entry.kind)), name: string(item.name, 60),
      x: number(item.x, 0, room.width), y: number(item.y, 0, room.depth),
      width: number(item.width, 10, 350), depth: number(item.depth, 10, 300), rotation: number(item.rotation, 0, 360),
      color: color(item.color), accent: color(item.accent), material: option(item.material, materials),
      pattern: option(item.pattern, patterns), shape: option(item.shape, ['Rounded', 'Square', 'Round']),
      text: string(item.text, 200), font: option(item.font, fonts), detail: number(item.detail, 0, 100),
      lightPower: number(item.lightPower, 0, 100), lightWarmth: number(item.lightWarmth, 0, 100),
      opacity: number(item.opacity, 15, 100), locked: boolean(item.locked), hidden: boolean(item.hidden),
    };
  });
  return { room, items };
}
export function decodeStudioSave(value: unknown): StudioSave {
  const data = record(value);
  if (data.version !== 1 || !Array.isArray(data.slots) || data.slots.length > 6) throw new Error('Unsupported studio save.');
  const ids = new Set<string>();
  return { version: 1, current: decodeDesign(data.current), slots: data.slots.map((value) => {
    const slot = record(value);
    const id = string(slot.id);
    if (!id || ids.has(id)) throw new Error('Duplicate or missing saved concept ID.');
    ids.add(id);
    return { id, name: string(slot.name, 60), design: decodeDesign(slot.design) };
  }) };
}

export function decodeMemoryDesign(value: unknown): MemoryDesignSetting {
  const data = record(value);
  if (data.version !== 1) throw new Error('Unsupported memory cafe design.');
  return { version: 1, enabled: boolean(data.enabled), design: decodeDesign(data.design) };
}

export function publishDesign(design: Design): MemoryDesignSetting {
  return decodeMemoryDesign({ version: 1, enabled: true, design });
}

export function designStats(design: Design) {
  const visible = design.items.filter((item) => !item.hidden);
  return {
    area: Math.round(design.room.width * design.room.depth / 10000 * 10) / 10,
    seats: visible.reduce((count, item) => count + (['chair', 'armchair', 'stool'].includes(furnishingRole(item.kind)) ? 1 : ['sofa', 'bench'].includes(item.kind) ? Math.max(1, Math.floor(item.width / 55)) : 0), 0),
    cost: design.items.reduce((cost, item) => cost + (catalog.find((entry) => entry.kind === item.kind)?.price ?? 0), 0),
    plants: visible.filter((item) => ['plant', 'planter'].includes(item.kind)).length,
    lights: visible.filter((item) => ['pendant', 'sconce', 'lamp'].includes(furnishingRole(item.kind))).length,
    tables: visible.filter((item) => ['table', 'dining', 'outdoor'].includes(item.kind)).length,
    coffeeBar: visible.some((item) => item.kind === 'counter') && visible.some((item) => item.kind === 'machine'),
    entrance: visible.some((item) => item.kind === 'door'),
  };
}
export const briefs = [
  { id: 'free', name: 'Your own little world', description: 'No timer, no rules, no budget limit. Make somewhere you would love to stay.' },
  { id: 'botanical', name: 'The botanical hideaway', description: 'A leafy retreat for six guests. Add four plants, two lights, and a working coffee bar. Concept budget: $9,000.' },
  { id: 'social', name: 'Coffee with company', description: 'A gathering spot for ten guests, with three tables, three lights, a coffee bar, and an entrance. Concept budget: $12,000.' },
  { id: 'tiny', name: 'Small space, big heart', description: 'Design a cafe no larger than 35 square meters with four seats, a table, a light, an entrance, and a coffee bar. Concept budget: $7,000.' },
] as const;
export function briefChecks(design: Design, id: string): { label: string; done: boolean }[] {
  const s = designStats(design);
  if (id === 'free') return [];
  const tiny = id === 'tiny';
  const social = id === 'social';
  return [
    { label: `${tiny ? 4 : social ? 10 : 6} guest seats`, done: s.seats >= (tiny ? 4 : social ? 10 : 6) },
    { label: `${social ? 3 : 1} dining table${social ? 's' : ''}`, done: s.tables >= (social ? 3 : 1) },
    { label: `${tiny ? 1 : social ? 3 : 2} light fixture${tiny ? '' : 's'}`, done: s.lights >= (tiny ? 1 : social ? 3 : 2) },
    { label: 'Counter + espresso machine', done: s.coffeeBar },
    { label: 'Entrance door', done: s.entrance },
    ...(id === 'botanical' ? [{ label: '4 leafy plants', done: s.plants >= 4 }] : []),
    ...(tiny ? [{ label: '35 square meters or less', done: s.area <= 35 }] : []),
    { label: `Within $${tiny ? '7,000' : social ? '12,000' : '9,000'} concept budget`, done: s.cost <= (tiny ? 7000 : social ? 12000 : 9000) },
  ];
}
