import { useId } from 'react';
import { outdoorFloorStyles } from './studioModel';
import type { OutdoorFloorStyle, Room } from './studioModel';
import { MaterialDefs } from './MaterialFinish';

export const floorDescriptions: Record<OutdoorFloorStyle, string> = {
  Grass: 'Green turf with fine blades; base color tints the lawn.',
  Decking: 'Long timber boards with grain and paired fixing screws.',
  'Brick pavers': 'Staggered rectangular bricks with contrasting mortar joints.',
  Cobblestone: 'Rounded irregular setts with inset edges and small gaps.',
  Flagstone: 'Large angular stone slabs with irregular joints.',
  Gravel: 'Dense pebbles of varied sizes with light and dark flecks.',
  'Stepping stones': 'Spaced stone pads over a contrasting garden ground.',
  Mosaic: 'Small alternating tiles around a diamond medallion.',
};

export function isOutdoorFloorStyle(style: Room['floorStyle']): style is OutdoorFloorStyle {
  return outdoorFloorStyles.some((entry) => entry === style);
}

export function OutdoorFloorTile({ style, color, accent }: { style: OutdoorFloorStyle; color: string; accent: string }) {
  const id = `lawn-${useId().replace(/:/g, '')}`;
  switch (style) {
    case 'Grass': return <>
      <MaterialDefs id={id} material="Grass" color={color} accent={accent} />
      <rect width="80" height="80" fill={`url(#surface-${id})`} />
    </>;
    case 'Decking': return <>
      <rect width="80" height="80" fill={color} />
      {[0, 20, 40, 60].map((x) => <g key={x}>
        <path d={`M${x} 0v80m2-80v80`} stroke={accent} strokeWidth="1" />
        <path d={`M${x+7} 0q8 20 0 40t0 40m6-80q-6 28 0 45t0 35`} fill="none" stroke={accent} opacity=".35" />
        {[5, 75].map((y) => <g key={y} fill={accent}><circle cx={x+5} cy={y} r="1" /><circle cx={x+15} cy={y} r="1" /></g>)}
      </g>)}
    </>;
    case 'Brick pavers': return <>
      <rect width="80" height="80" fill={color} />
      <path d="M0 0h80M0 20h80M0 40h80M0 60h80M0 80h80M0 0v20m40-20v20m40-20v20M20 20v20m40-20v20M0 40v20m40-20v20m40-20v20M20 60v20m40-20v20" fill="none" stroke={accent} strokeWidth="2.5" />
      <path d="M5 5h29M25 25h29M5 45h29M25 65h29" stroke="#fff" opacity=".18" />
    </>;
    case 'Cobblestone': return <>
      <rect width="80" height="80" fill={accent} />
      {Array.from({ length: 16 }, (_, i) => <g key={i}>
        <rect x={i % 4 * 20 + 2} y={Math.floor(i / 4) * 20 + 2} width={i % 3 ? 17 : 15} height={i % 2 ? 16 : 17} rx={4 + i % 3} fill={color} />
        <path d={`M${i % 4 * 20 + 5} ${Math.floor(i / 4) * 20 + 6}h9`} stroke="#fff" opacity=".22" />
      </g>)}
    </>;
    case 'Flagstone': return <>
      <rect width="80" height="80" fill={color} />
      <path d="M0 24 28 17 45 0m-17 17 9 31-20 32m20-32 31-8 12 13M68 40 59 10 80 6M37 48l19 25 24-7" fill="none" stroke={accent} strokeWidth="3" />
      <path d="m3 28 22-6 8 24-16 27L3 68zm41 22 21-5 10 10-19 13z" fill="#fff" opacity=".12" />
    </>;
    case 'Gravel': return <>
      <rect width="80" height="80" fill={color} />
      {Array.from({ length: 80 }, (_, i) => <ellipse key={i} cx={(i * 37 + 3) % 80} cy={(i * 23 + 5) % 80} rx={2 + i % 3} ry={1 + i % 3} transform={`rotate(${i * 29 % 180} ${(i * 37 + 3) % 80} ${(i * 23 + 5) % 80})`} fill={i % 4 === 0 ? '#fff' : i % 4 === 1 ? '#26342a' : accent} opacity={i % 4 < 2 ? .25 : .7} />)}
    </>;
    case 'Stepping stones': return <>
      <rect width="80" height="80" fill={accent} />
      <path d="m4 8 25-4 9 13-7 17-24-2-5-14zm44 36 23-5 8 14-8 22-25-4-6-15z" fill={color} stroke="#354c42" strokeOpacity=".3" strokeWidth="2" />
      <path d="m47 5 3 6m14 15 4-6M6 57l4-7m16 24 3-6" stroke={color} strokeWidth="1.5" opacity=".6" />
    </>;
    case 'Mosaic': return <>
      <rect width="80" height="80" fill={color} />
      {Array.from({ length: 64 }, (_, i) => <rect key={i} x={i % 8 * 10 + 1} y={Math.floor(i / 8) * 10 + 1} width="8" height="8" fill={accent} opacity={(i + Math.floor(i / 8)) % 2 ? .25 : .8} />)}
      <path d="m40 18 22 22-22 22-22-22z" fill={color} stroke={accent} strokeWidth="3" />
      <path d="m40 30 10 10-10 10-10-10z" fill={accent} />
    </>;
  }
}
