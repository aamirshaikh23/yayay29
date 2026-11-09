import { catalog, furnishingRole } from './studioModel';
import type { Design, Furnishing, Material, Room } from './studioModel';
import { furnishingHeight } from './studioView';

export type Triple = [number, number, number];
export function memoryInteriorCamera(room: Room, aspect: number): { position: Triple; target: Triple; fov: number } {
  const depth = room.depth / 100;
  return {
    position: [0, 1.55, depth / 2 - .18],
    target: [0, 1.35, -depth / 2],
    fov: aspect < 1 ? 70 : 60,
  };
}
export type Finish = 'main' | 'accent' | 'glass' | 'leaf' | 'bulb' | 'dark' | 'paper' | 'coffee' | 'pot';
export interface Part {
  geometry: 'box' | 'cylinder' | 'sphere' | 'torus';
  position: Triple;
  size: Triple;
  rotation?: Triple;
  finish: Finish;
}
export const isLight = (item: Furnishing) => ['lamp', 'sconce', 'pendant'].includes(furnishingRole(item.kind));
export const isWallMounted = (item: Furnishing) => ['window', 'art', 'mirror', 'clock', 'sconce', 'shelf', 'sign', 'menu'].includes(furnishingRole(item.kind)) && !['chalkboard', 'menustand'].includes(item.kind);
const tabletop = new Set(['machine', 'grinder', 'display', 'sink', 'cups', 'vase', 'books', 'cushion', 'kettle', 'dripper', 'toaster', 'tray', 'candle', 'sculpture', 'recordplayer']);
export const isTabletop = (item: Furnishing) => tabletop.has(furnishingRole(item.kind)) || ['tablelamp', 'desklamp', 'menustand'].includes(item.kind);

export function height3d(item: Furnishing) { return (item.height ?? furnishingHeight(item)) / 100; }
export function position3d(item: Furnishing, design: Design): Triple {
  const { room } = design;
  let base = furnishingRole(item.kind) === 'rug' ? .012 : 0;
  if (isWallMounted(item)) base = furnishingRole(item.kind) === 'window' ? .75 : furnishingRole(item.kind) === 'shelf' ? .8 : 1.25;
  if (furnishingRole(item.kind) === 'pendant') base = Math.max(.3, 3.2 - height3d(item));
  if (isTabletop(item)) {
    const support = [...design.items].reverse().find((other) => {
      if (other.id === item.id || other.hidden) return false;
      const role = furnishingRole(other.kind);
      if (!['table', 'dining', 'side', 'outdoor', 'counter', 'cabinet'].includes(role)
        && !(item.kind === 'cushion' && ['chair', 'armchair', 'sofa', 'bench'].includes(role))) return false;
      const angle = other.rotation * Math.PI / 180;
      const dx = item.x - other.x;
      const dz = item.y - other.y;
      const x = dx * Math.cos(angle) - dz * Math.sin(angle);
      const z = dx * Math.sin(angle) + dz * Math.cos(angle);
      return Math.abs(x) <= other.width / 2 && Math.abs(z) <= other.depth / 2;
    });
    if (support) base = height3d(support) * (item.kind === 'cushion' ? .48 : 1) + (support.elevation ?? 0) / 100;
  }
  return [(item.x - room.width / 2) / 100, base + (item.elevation ?? 0) / 100, (item.y - room.depth / 2) / 100];
}

export function moveOnFloor(item: Furnishing, dx: number, dz: number): Furnishing {
  return { ...item, x: item.x + dx * 100, y: item.y + dz * 100 };
}

export function materialPhysics(material: Material) {
  const metalness = material === 'Chrome' ? 1 : material === 'Brass' ? .85 : material === 'Metal' ? .72 : 0;
  const roughness = { Oak: .65, Walnut: .5, Marble: .2, Terrazzo: .42, Metal: .32, Velvet: .95, Linen: 1, Rattan: .85, Leather: .48, Boucle: 1, Brass: .22, Chrome: .08, Ceramic: .12, Concrete: .98, Glass: .06, Cork: 1, Grass: 1 }[material];
  return { metalness, roughness, transmission: material === 'Glass' ? .7 : 0, clearcoat: ['Ceramic', 'Marble', 'Leather'].includes(material) ? .55 : 0 };
}

export function furnitureParts(item: Furnishing): Part[] {
  const entry = catalog.find((entry) => entry.kind === item.kind);
  if (!entry) throw new Error(`Missing 3D catalog entry: ${item.kind}`);
  const style = entry.style ?? item.kind;
  const role = furnishingRole(item.kind);
  const parts: Part[] = [];
  const box = (position: Triple, size: Triple, finish: Finish = 'main', rotation?: Triple) => parts.push({ geometry: 'box', position, size, finish, rotation });
  const cylinder = (position: Triple, size: Triple, finish: Finish = 'main', rotation?: Triple) => parts.push({ geometry: 'cylinder', position, size, finish, rotation });
  const sphere = (position: Triple, size: Triple, finish: Finish = 'main') => parts.push({ geometry: 'sphere', position, size, finish });
  const torus = (position: Triple, size: Triple, finish: Finish = 'accent', rotation?: Triple) => parts.push({ geometry: 'torus', position, size, finish, rotation });
  const legs = (top = .45, inset = .36) => {
    for (const x of [-inset, inset]) for (const z of [-inset, inset]) cylinder([x, top / 2, z], [.055, top, .055], 'accent');
  };
  const seat = (y = .48) => {
    if (item.shape === 'Round') cylinder([0, y, 0], [.88, .14, .88]);
    else box([0, y, 0], [.88, .14, .85]);
  };
  const frame = (glass = false) => {
    box([0, .5, 0], [.94, .94, .2], glass ? 'glass' : 'main');
    for (const x of [-.47, .47]) box([x, .5, .05], [.06, 1, .32], 'accent');
    for (const y of [.03, .97]) box([0, y, .05], [1, .06, .32], 'accent');
  };
  const shade = (y: number, width = .8) => {
    cylinder([0, y, 0], [width, .22, width]);
    sphere([0, y - .12, 0], [.16, .15, .16], 'bulb');
  };
  const labelBoard = () => {
    box([0, .52, 0], [.9, .88, .15], 'accent');
    box([0, .52, .085], [.78, .76, .025], role === 'menu' ? 'dark' : 'main');
  };

  if (['chair', 'armchair', 'sofa', 'bench', 'stool'].includes(role)) {
    if (style === 'ottoman') { cylinder([0, .5, 0], [.96, .95, .96]); cylinder([0, .97, 0], [.96, .055, .96], 'accent'); }
    else if (role === 'stool') { legs(.84); seat(.9); cylinder([0, .32, 0], [.7, .04, .7], 'accent'); }
    else {
      legs(); seat();
      if (['spindle', 'bentwood', 'canechair', 'gardenbench'].includes(style)) {
        for (const x of [-.42, .42]) cylinder([x, .69, -.36], [.055, .58, .055], 'accent');
        box([0, .95, -.36], [.9, .09, .12], 'accent');
        if (style === 'canechair') box([0, .75, -.36], [.72, .3, .05]);
        else for (const x of [-.28, -.14, 0, .14, .28]) cylinder([x, .74, -.36], [.035, .38, .035], 'accent');
      } else {
        box([0, .76, -.34], [.94, .48, .2]);
        if (['sofa', 'bench'].includes(role)) {
          for (const x of [-.24, .24]) box([x, .59, .04], [.44, .1, .68]);
          box([0, .8, -.21], [.025, .28, .015], 'accent');
        }
      }
      if (role === 'armchair' || role === 'sofa' || style === 'booth') {
        for (const x of [-.45, .45]) box([x, .62, 0], [.12, .28, .85]);
      }
      if (style === 'wingback') for (const x of [-.43, .43]) box([x, .86, -.24], [.14, .28, .38]);
    }
  } else if (['table', 'dining', 'side', 'outdoor'].includes(role)) {
    if (style === 'plinth') { cylinder([0, .48, 0], [.8, .96, .8]); cylinder([0, .97, 0], [1, .06, 1]); }
    else {
      if (item.shape === 'Round' || style === 'nesting') cylinder([0, .96, 0], [1, .08, 1]);
      else box([0, .96, 0], [1, .08, 1]);
      if (['dining', 'coffeetable', 'console', 'picnictable'].includes(style) || role === 'dining') legs(.92);
      else { cylinder([0, .45, 0], [.12, .9, .12], 'accent'); cylinder([0, .035, 0], [.62, .07, .62], 'accent'); }
      if (style === 'console') box([0, .78, 0], [.9, .22, .82]);
      if (style === 'nesting') { cylinder([.35, .59, .32], [.66, .065, .66], 'accent'); cylinder([.35, .3, .32], [.06, .58, .06], 'accent'); }
      if (style === 'picnictable') for (const z of [-.48, .48]) box([0, .52, z], [1, .07, .2]);
    }
  } else if ((['counter', 'cabinet', 'fridge'].includes(role) && style !== 'bakeryrack') || ['oven', 'toaster', 'scale', 'recordplayer'].includes(style)) {
    box([0, .47, 0], [.96, .92, .95]);
    box([0, .96, 0], [1, .08, 1], role === 'counter' ? 'main' : 'accent');
    if (['oven', 'fridge', 'toaster'].includes(style) || role === 'fridge') {
      box([0, .52, .485], [.78, .6, .025], style === 'oven' ? 'glass' : 'accent');
      box([.28, .6, .53], [.045, .28, .05], 'dark');
    } else if (style === 'scale') box([0, .9, .4], [.4, .02, .13], 'dark');
    else if (style === 'recordplayer') {
      cylinder([-.1, 1.02, 0], [.65, .025, .65], 'dark'); cylinder([-.1, 1.04, 0], [.15, .025, .15], 'paper');
      box([.3, 1.07, 0], [.03, .03, .6], 'accent');
    } else {
      for (const x of [-.3, 0, .3]) { box([x, .47, .49], [.28, .8, .025], 'accent'); box([x, .7, .52], [.12, .02, .03], 'main'); }
    }
  } else if (role === 'machine' || role === 'grinder') {
    if (style === 'grinder' || style === 'blender') {
      box([0, .2, 0], [.8, .4, .8]); cylinder([0, .67, 0], [.68, .55, .65], style === 'blender' ? 'glass' : 'coffee');
      cylinder([0, .98, 0], [.74, .05, .74], 'accent'); box([0, .32, .43], [.22, .2, .08], 'accent');
    } else {
      box([0, .55, -.1], [.98, .8, .75]); box([0, .08, .1], [1, .08, 1], 'accent');
      box([0, .48, .3], [.85, .3, .03], 'dark');
      for (const x of [-.28, .28]) {
        cylinder([x, .78, .3], [.2, .04, .2], 'paper', [Math.PI / 2, 0, 0]);
        cylinder([x, .43, .36], [.08, .2, .08], 'accent'); cylinder([x, .18, .32], [.2, .18, .2], 'paper');
      }
    }
  } else if (role === 'display' || ['shelf', 'bakeryrack'].includes(style)) {
    for (const x of [-.46, .46]) for (const z of [-.4, .4]) box([x, .5, z], [.045, 1, .05], 'accent');
    for (const y of [.05, .42, .8]) {
      box([0, y, 0], [1, .055, .95]);
      for (const x of [-.3, 0, .3]) {
        if (style === 'shelf') cylinder([x, y + .1, 0], [.16, .16, .24], 'paper');
        else sphere([x, y + .08, 0], [.22, .12, .35], 'coffee');
      }
    }
    if (role === 'display') { box([0, .5, .45], [.94, .94, .015], 'glass'); box([0, .98, 0], [.98, .02, .95], 'glass'); }
  } else if (role === 'door' || role === 'window' || ['curtains', 'archway'].includes(style)) {
    if (style === 'archway' || style === 'archedwindow') {
      for (const x of [-.45, .45]) box([x, .32, 0], [.1, .64, .5]);
      for (let i = 0; i < 12; i++) {
        const angle = i / 11 * Math.PI;
        box([Math.cos(angle) * .45, .62 + Math.sin(angle) * .34, 0], [.14, .1, .5], 'main', [0, 0, angle - Math.PI / 2]);
      }
      if (style === 'archedwindow') box([0, .47, 0], [.8, .8, .12], 'glass');
    } else if (style === 'curtains') {
      cylinder([0, .98, 0], [.025, 1, .025], 'accent', [0, 0, Math.PI / 2]);
      for (const x of [-.4, -.3, -.2, .2, .3, .4]) cylinder([x, .48, 0], [.13, .94, .3]);
    } else {
      frame(true);
      box([0, .5, .1], [.035, .96, .08], 'accent');
      for (const y of [.32, .65]) box([0, y, .1], [.96, .025, .08], 'accent');
      if (role === 'door') sphere([.31, .45, .24], [.045, .025, .1], 'accent');
      else box([0, .02, .08], [1.1, .06, .75], 'accent');
    }
  } else if (role === 'partition') {
    if (style === 'patioheater') {
      cylinder([0, .06, 0], [.65, .12, .65]); cylinder([0, .48, 0], [.08, .84, .08], 'accent');
      cylinder([0, .84, 0], [.28, .13, .28], 'bulb'); cylinder([0, .96, 0], [1, .05, 1]);
    } else if (style === 'column') {
      cylinder([0, .5, 0], [.7, .94, .7]); cylinder([0, .03, 0], [1, .06, 1]); cylinder([0, .97, 0], [1, .06, 1]);
    } else {
      box([0, .03, 0], [1, .06, .7], 'accent'); box([0, .97, 0], [1, .06, .7], 'accent');
      if (style === 'glassdivider' || style === 'wallpanel') box([0, .5, 0], [.95, .9, .4], style === 'glassdivider' ? 'glass' : 'main');
      else for (let i = 0; i < 10; i++) box([-.45 + i * .1, .5, 0], [.045, .96, .5]);
    }
  } else if (isLight(item) || role === 'umbrella') {
    if (role === 'pendant') {
      cylinder([0, .75, 0], [.025, .5, .025], 'accent');
      if (['globe', 'lantern', 'chandelier'].includes(style)) {
        const xs = style === 'chandelier' ? [-.32, 0, .32] : [0];
        if (xs.length > 1) box([0, .48, 0], [.9, .025, .025], 'accent');
        for (const x of xs) sphere([x, .27, 0], [xs.length > 1 ? .28 : .85, .5, .85], 'main');
      } else if (style === 'tracklight') {
        box([0, .7, 0], [1, .04, .18], 'accent');
        for (const x of [-.35, 0, .35]) cylinder([x, .4, 0], [.2, .5, .6]);
      } else shade(.25);
      sphere([0, .15, 0], [.16, .15, .16], 'bulb');
    } else if (role === 'sconce') {
      box([0, .5, -.3], [.15, .6, .2], 'accent');
      sphere([0, .5, .1], [.7, .7, .7]); sphere([0, .45, .3], [.3, .3, .3], 'bulb');
    } else if (style === 'outdoorlantern') {
      frame(true); cylinder([0, .25, 0], [.35, .45, .35]); sphere([0, .53, 0], [.08, .14, .08], 'bulb');
    } else {
      cylinder([0, .03, 0], [.6, .06, .6], 'accent');
      cylinder([0, .44, 0], [.04, .84, .04], 'accent');
      if (role === 'umbrella') { cylinder([0, .95, 0], [1, .1, 1]); }
      else if (style === 'tablelamp') { cylinder([0, .37, 0], [.23, .6, .23]); sphere([0, .8, 0], [1, .4, 1]); sphere([0, .64, 0], [.18, .1, .18], 'bulb'); }
      else shade(.86);
    }
  } else if (role === 'plant' || role === 'planter') {
    cylinder([0, .16, 0], [.5, .32, .5], 'pot');
    cylinder([0, .31, 0], [.56, .055, .56], 'pot');
    cylinder([0, .34, 0], [.42, .015, .42], 'dark');
    cylinder([0, .54, 0], [.04, .45, .04], 'leaf');
    if (style === 'cactus') {
      cylinder([0, .64, 0], [.2, .68, .2], 'leaf');
      for (const x of [-.24, .24]) { cylinder([x, .6, 0], [.13, .35, .15], 'leaf'); box([x / 2, .48, 0], [.25, .1, .12], 'leaf'); }
    } else if (style === 'snakeplant' || style === 'bamboo') {
      for (let i = 0; i < 7; i++) {
        const angle = i * 2.4;
        const x = Math.cos(angle) * .19, z = Math.sin(angle) * .19;
        cylinder([x, .61, z], [style === 'bamboo' ? .04 : .07, .55 + i % 3 * .08, .06], 'leaf');
        if (style === 'bamboo') sphere([x + .1, .75, z], [.28, .06, .12], 'leaf');
      }
    } else {
      for (let i = 0; i < (item.detail < 25 ? 5 : 10); i++) {
        const angle = i * 2.4;
        const radius = style === 'olivetree' ? .24 : .28;
        const low = style === 'succulent';
        sphere([Math.cos(angle) * radius, low ? .42 + i % 3 * .06 : .54 + (i % 4) * .11, Math.sin(angle) * radius],
          [style === 'palm' ? .65 : .4, ['fern', 'palm', 'succulent'].includes(style) ? .12 : .3, style === 'rubbertree' ? .22 : .4], 'leaf');
      }
    }
  } else if (role === 'rug') {
    if (item.shape === 'Round') cylinder([0, .008, 0], [1, .016, 1]);
    else box([0, .008, 0], [1, .016, 1]);
  } else if (role === 'art' || role === 'mirror' || role === 'sign' || role === 'menu' || role === 'clock') {
    if (role === 'clock' || style === 'roundmirror' || style === 'wallplates') {
      cylinder([0, .5, 0], [.95, .12, .95], 'accent', [Math.PI / 2, 0, 0]);
      cylinder([0, .5, .07], [.8, .025, .8], role === 'mirror' ? 'glass' : 'paper', [Math.PI / 2, 0, 0]);
      if (role === 'clock') { box([0, .66, .1], [.025, .3, .025], 'dark'); box([.13, .5, .1], [.28, .025, .025], 'dark'); }
    } else {
      labelBoard();
      if (role === 'art') {
        sphere([.18, .68, .12], [.3, .3, .025]);
        box([-.12, .37, .1], [.25, .32, .025], 'paper', [0, 0, -.3]);
      }
      if (['chalkboard', 'menustand'].includes(style)) for (const x of [-.42, .42]) box([x, .1, .22], [.055, .2, .5], 'accent');
    }
  } else if (role === 'cups' || role === 'kettle') {
    cylinder([0, .4, 0], [.65, .66, .65]); cylinder([0, .75, 0], [.59, .025, .59], 'coffee');
    torus([.4, .42, 0], [.25, .32, .12], 'accent');
    if (role === 'cups') cylinder([0, .035, 0], [1, .035, 1]);
    else { cylinder([0, .8, 0], [.74, .08, .74], 'accent'); sphere([0, .9, 0], [.12, .12, .12], 'accent'); cylinder([-.4, .55, 0], [.12, .4, .12], 'main', [0, 0, -.8]); }
    if (style === 'dispenser') { box([0, .2, .4], [.12, .1, .2], 'accent'); }
  } else if (role === 'vase' || role === 'sculpture') {
    if (style === 'sculpture') torus([0, .53, 0], [.85, .85, .3], 'main');
    else {
      sphere([0, .32, 0], [.7, .6, .7]); cylinder([0, .65, 0], [.3, .4, .3]);
      if (!['jar', 'vasepair'].includes(style)) for (const x of [-.3, 0, .3]) { cylinder([x, .8, 0], [.02, .35, .02], 'leaf'); sphere([x, .98, 0], [.25, .18, .25]); }
    }
  } else if (role === 'books') {
    if (style === 'tins') for (const x of [-.32, 0, .32]) cylinder([x, .5, 0], [.28, .95, .8]);
    else for (let i = 0; i < 3; i++) { box([i % 2 * .05, .18 + i * .3, 0], [.94, .26, .9], i % 2 ? 'accent' : 'main'); box([0, .18 + i * .3, .46], [.85, .18, .015], 'paper'); }
  } else if (role === 'cushion') sphere([0, .45, 0], [1, .9, .9]);
  else if (role === 'basket') { cylinder([0, .4, 0], [.92, .8, .92]); torus([0, .8, 0], [.6, .4, .15], 'accent'); }
  else if (role === 'tray' || role === 'sink') {
    box([0, .1, 0], [1, .12, 1]); for (const x of [-.47, .47]) box([x, .45, 0], [.06, .7, 1], 'accent');
    for (const z of [-.47, .47]) box([0, .45, z], [1, .7, .06], 'accent');
    if (role === 'sink') cylinder([.3, .8, -.3], [.06, .4, .06], 'accent');
  } else if (role === 'dripper') {
    cylinder([0, .27, 0], [.7, .5, .7], 'glass'); cylinder([0, .68, 0], [.8, .32, .8]); cylinder([0, .86, 0], [.72, .03, .72], 'coffee');
  } else if (role === 'candle') {
    cylinder([0, .44, 0], [.6, .85, .6]); sphere([0, .92, 0], [.1, .16, .1], 'bulb');
  } else throw new Error(`No 3D model for ${item.kind} (${role}).`);
  return parts;
}
