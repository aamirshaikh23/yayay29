import { catalog, furnishingRole } from './studioModel';
import type { Design, Furnishing, Room } from './studioModel';

export const SCENE_WIDTH = 1200;
export const SCENE_HEIGHT = 720;
export const SCENE_VIEWBOX = `0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`;

export function projectFloor(x: number, y: number, room: Room) {
  const distance = y / room.depth;
  const span = 840 + 320 * distance;
  return { x: 600 + (x / room.width - .5) * span, y: 390 + 280 * distance, scale: span / room.width };
}

export function unprojectFloor(x: number, y: number, room: Room) {
  const distance = (y - 390) / 280;
  return { x: ((x - 600) / (840 + 320 * distance) + .5) * room.width, y: distance * room.depth };
}

export function moveInScene(item: Furnishing, dx: number, dy: number, room: Room) {
  const start = projectFloor(item.x, item.y, room);
  return { ...item, ...unprojectFloor(start.x + dx, start.y + dy, room) };
}

const wallKinds = new Set(['window', 'art', 'mirror', 'menu', 'sign', 'clock', 'sconce', 'shelf']);
const tableKinds = new Set(['table', 'dining', 'side', 'outdoor', 'coffeetable']);
const accessoryKinds = new Set(['machine', 'grinder', 'display', 'sink', 'cups', 'vase', 'books', 'cushion', 'kettle', 'dripper', 'toaster', 'tray', 'candle', 'sculpture', 'recordplayer', 'tablelamp']);

export function furnishingHeight(item: Furnishing): number {
  const heights: Record<string, number> = {
    chair: 92, armchair: 88, sofa: 88, bench: 85, stool: 75, table: 74, dining: 74, side: 52, outdoor: 74,
    counter: 100, cabinet: 96, machine: 48, grinder: 52, display: 60, sink: 28, fridge: 92, shelf: 135,
    door: 235, window: 160, partition: 165, pendant: 70, sconce: 48, lamp: 160,
    plant: 115, planter: 75, vase: 42, art: 85, mirror: 100, books: 18, cups: 18, cushion: 28,
    clock: 45, menu: 95, sign: 52, umbrella: 225, rug: 8,
    ottoman: 42, coffeetable: 42, kettle: 30, dripper: 40, toaster: 27,
    tray: 8, candle: 30, sculpture: 48, basket: 45, recordplayer: 20, tablelamp: 45,
  };
  const entry = catalog.find((entry) => entry.kind === item.kind);
  const scale = entry ? Math.sqrt(item.width * item.depth / (entry.width * entry.depth)) : 1;
  return (heights[item.kind] ?? heights[furnishingRole(item.kind)] ?? 80) * scale;
}

export function scenePlacement(item: Furnishing, design: Design) {
  const floor = projectFloor(item.x, item.y, design.room);
  const angle = item.rotation * Math.PI / 180;
  const yaw = Math.max(.25, Math.abs(Math.cos(angle)) + Math.abs(Math.sin(angle)) * .45);
  const width = Math.max(12, item.width * floor.scale * yaw);
  const height = furnishingHeight(item) * floor.scale * 1.25;
  let base = floor.y;
  if (wallKinds.has(item.kind)) base -= (item.kind === 'window' || item.kind === 'shelf' ? 35 : 100) * floor.scale;
  if (item.kind === 'pendant') base = 125 + item.y / design.room.depth * 65;
  if (accessoryKinds.has(item.kind)) {
    const support = [...design.items].reverse().find((other) => !other.hidden && other.id !== item.id
      && (other.kind === 'counter' || tableKinds.has(other.kind) || (item.kind === 'cushion' && ['sofa', 'bench', 'armchair'].includes(other.kind)))
      && Math.abs(other.x - item.x) <= other.width / 2 && Math.abs(other.y - item.y) <= other.depth / 2);
    if (support) base -= furnishingHeight(support) * floor.scale * 1.25 * .82;
  }
  return { x: floor.x, y: base, width, height, mirror: Math.cos(angle) < 0 ? -1 : 1, scale: floor.scale };
}
