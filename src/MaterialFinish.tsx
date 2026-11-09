import { useId } from 'react';
import type { Material, Pattern } from './studioModel';

export const materialDescriptions: Record<Material, string> = {
  Oak: 'Open grain and pale timber rings',
  Walnut: 'Dark flowing grain and elongated knots',
  Marble: 'Branching stone veins and polished highlights',
  Terrazzo: 'Multicolored angular stone chips',
  Metal: 'Brushed horizontal grain and a satin sheen',
  Velvet: 'Soft directional pile and deep shaded folds',
  Linen: 'Matte, cross-woven natural threads',
  Rattan: 'Open cane lattice with woven intersections',
  Leather: 'Pebbled hide with stitched seams',
  Boucle: 'Raised loops and clustered wool knots',
  Brass: 'Warm gold reflections and a polished band',
  Chrome: 'Sharp silver mirror bands',
  Ceramic: 'Smooth glaze with a bright curved reflection',
  Concrete: 'Matte gray mineral pores and mottling',
  Glass: 'Cool tinted glazing and diagonal reflections',
  Cork: 'Warm irregular granules and dark flecks',
};

function Texture({ material }: { material: Material }) {
  switch (material) {
    case 'Oak': return <g fill="none" stroke="#573a22" strokeWidth="1.1" opacity=".48"><path d="M0 4q10-6 20 0t20 0M0 11q12-5 25 0t15 0M0 23q8-8 20-2t20 2M0 36q11-6 24 0t16 0" /><ellipse cx="22" cy="21" rx="10" ry="4" /><ellipse cx="22" cy="21" rx="4" ry="1.5" /></g>;
    case 'Walnut': return <><rect width="40" height="40" fill="#352015" opacity=".28" /><g fill="none" stroke="#3b241b" strokeWidth="1.6" opacity=".65"><path d="M3 0q15 18 0 40M13 0q17 20 0 40M25 0q-14 20 0 40M36 0q-13 22 0 40" /><ellipse cx="19" cy="21" rx="3" ry="12" /></g></>;
    case 'Marble': return <><rect width="40" height="40" fill="#fff" opacity=".35" /><path d="m-4 3 16 9 2 8 15 8 15 5M12 12l14-10M14 20 3 36m26-8 2-12" fill="none" stroke="#474749" strokeWidth="1.8" opacity=".65" /><path d="m-4 6 14 8 1 8 18 9 15 5" fill="none" stroke="#fff" strokeWidth="2" opacity=".85" /></>;
    case 'Terrazzo': return <><path d="m2 3 9 1-3 9-7-3m23 7 11 2-4 10-10-3" fill="#665f55" /><path d="m14 21 5-6 5 11-7 6M31 2l7 3-5 7z" fill="#ba7864" /><path d="m2 28 8-3 3 9-9 4m26-4 7-4 2 8" fill="#f3e8cd" /><circle cx="18" cy="6" r="2" fill="#526f61" /><circle cx="35" cy="25" r="2" fill="#526f61" /></>;
    case 'Metal': return <g strokeWidth=".7">{Array.from({ length: 14 }, (_, i) => <path key={i} d={`M0 ${i * 3}h40`} stroke={i % 2 ? '#fff' : '#26343d'} opacity={i % 2 ? .4 : .22} />)}</g>;
    case 'Velvet': return <><path d="M3 0q14 18 0 40h10q14-18 0-40zm21 0q-12 20 0 40h11q-13-20 0-40z" fill="#fff" opacity=".13" /><path d="M15 0q12 18 0 40m22-40q-12 22 0 40" fill="none" stroke="#20182a" strokeOpacity=".25" strokeWidth="4" /></>;
    case 'Linen': return <><rect width="40" height="40" fill="#fff4d8" opacity=".17" />{Array.from({ length: 8 }, (_, i) => <g key={i}><path d={`M${i * 5} 0v40`} stroke="#fff9e8" strokeWidth="2" opacity=".65" /><path d={`M0 ${i * 5}h40`} stroke="#514535" strokeWidth="1" opacity=".4" /></g>)}</>;
    case 'Rattan': return <><rect width="40" height="40" fill="#46301c" opacity=".5" /><path d="m-20 0 40 40m-20-40 40 40m-20-40 40 40m-20-40 40 40M-20 40 20 0M0 40 40 0m-20 40L60 0" stroke="#edcd91" strokeWidth="5" /><path d="M0 10h40M10 0v40M30 0v40M0 30h40" stroke="#7b572e" strokeWidth="2" opacity=".8" /></>;
    case 'Leather': return <><g fill="none" stroke="#322219" strokeWidth=".9" opacity=".4"><path d="m0 4 8-2 6 6 9-4 7 7 10-4M0 22l6-8 9 5 4 10 12-6 9 6M0 37l10-6 9 6 12-2 9 5" /></g><path d="M4 0v40" stroke="#34261e" strokeWidth="2" opacity=".55" /><path d="M7 0v40" stroke="#f8e6c6" strokeWidth="1.5" strokeDasharray="3 3" /></>;
    case 'Boucle': return <g>{Array.from({ length: 25 }, (_, i) => { const x = i % 5 * 8 + 4; const y = Math.floor(i / 5) * 8 + 4; return <g key={i}><circle cx={x + 1} cy={y + 1} r="3.3" fill="#413c31" opacity=".35" /><circle cx={x} cy={y} r="2.8" fill="none" stroke="#fff6df" strokeWidth="2" opacity=".85" /></g>; })}</g>;
    case 'Brass': return <><rect width="40" height="40" fill="#c69335" opacity=".45" /><path d="M4 0h3v40H4M33 0h1v40" fill="#fff2b5" opacity=".6" /></>;
    case 'Chrome': return <path d="M0 8h40v2H0m0 18h40v3H0" fill="#fff" opacity=".65" />;
    case 'Ceramic': return <><path d="M7-5q-10 25 0 50" fill="none" stroke="#fff" strokeWidth="5" opacity=".7" /><path d="M34-5q8 25 0 50" fill="none" stroke="#2b3439" strokeWidth="2" opacity=".18" /></>;
    case 'Concrete': return <><rect width="40" height="40" fill="#727973" opacity=".45" /><path d="m0 0 22 5-8 19L0 30m40-20-12 9 12 21" fill="#fff" opacity=".09" />{Array.from({ length: 19 }, (_, i) => <circle key={i} cx={(i * 17 + 3) % 40} cy={(i * 23 + 9) % 40} r={i % 3 === 0 ? 1.6 : .6} fill="#303530" opacity=".5" />)}</>;
    case 'Glass': return <><rect width="40" height="40" fill="#a5d6e0" opacity=".35" /><path d="M-10 40 20 0h8L-2 40m16 0L44 0h3L17 40" fill="#fff" opacity=".65" /><path d="M0 39h40" stroke="#247f92" opacity=".5" /></>;
    case 'Cork': return <><rect width="40" height="40" fill="#bf8e4d" opacity=".4" />{Array.from({ length: 16 }, (_, i) => <path key={i} d={`m${i % 4 * 10} ${Math.floor(i / 4) * 10} 7 2-2 6-5-1z`} fill={i % 3 ? '#5d3c21' : '#f3d9a0'} opacity={i % 3 ? .35 : .65} />)}</>;
  }
}

export function MaterialDefs({ id, material, color, accent, pattern = 'Plain' }: { id: string; material: Material; color: string; accent: string; pattern?: Pattern }) {
  const reflection = material === 'Chrome'
    ? [['0', '#26343d'], ['.2', '#f7ffff'], ['.4', '#818e98'], ['.48', '#273944'], ['.52', '#fff'], ['.8', '#b9c9d4'], ['1', '#fff']]
    : material === 'Brass'
      ? [['0', '#62411a'], ['.22', '#b27c28'], ['.43', '#ffedab'], ['.52', '#fff8d4'], ['.65', '#ad7924'], ['1', '#e3b651']]
      : material === 'Velvet'
        ? [['0', '#1d172b'], ['.45', '#ffffff'], ['1', '#23172c']]
        : [['0', '#ffffff'], ['.35', '#ffffff'], ['1', '#182d32']];
  const sheen = ['Chrome', 'Brass', 'Velvet', 'Ceramic', 'Glass', 'Metal'].includes(material);
  return <defs>
    <linearGradient id={`sheen-${id}`} x1="0" x2={material === 'Glass' ? '1' : '0'} y1="0" y2="1">
      {reflection.map(([offset, stopColor]) => <stop key={offset} offset={offset} stopColor={stopColor} />)}
    </linearGradient>
    <g id={`texture-${id}`}><Texture material={material} />
      {pattern === 'Stripes' && <path d="M5 0v40m20-40v40" stroke={accent} strokeWidth="7" strokeOpacity=".65" />}
      {pattern === 'Checks' && <g fill={accent} opacity=".6"><rect width="20" height="20" /><rect x="20" y="20" width="20" height="20" /></g>}
      {pattern === 'Dots' && <g fill={accent} opacity=".8"><circle cx="10" cy="10" r="4" /><circle cx="30" cy="30" r="4" /></g>}
    </g>
    {(['surface', 'accent'] as const).map((part) => <g key={part}>
      <pattern id={`grain-${part}-${id}`} width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill={part === 'surface' ? color : accent} /><use href={`#texture-${id}`} />
      </pattern>
      <pattern id={`${part}-${id}`} width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill={`url(#grain-${part}-${id})`} />
        {sheen && <rect width="100" height="100" fill={`url(#sheen-${id})`} opacity={['Brass', 'Chrome'].includes(material) ? .85 : material === 'Velvet' ? .35 : .28} />}
      </pattern>
    </g>)}
  </defs>;
}

export function MaterialSample({ material, color, accent, seamless = false, pattern = 'Plain' }: { material: Material; color: string; accent: string; seamless?: boolean; pattern?: Pattern }) {
  const id = useId().replace(/:/g, '');
  return <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
    <MaterialDefs id={id} material={material} color={color} accent={accent} pattern={pattern} />
    {seamless ? <rect width="100" height="100" fill={`url(#surface-${id})`} /> : <rect x="2" y="2" width="96" height="96" rx="9" fill={`url(#surface-${id})`} stroke="#564c3e" strokeOpacity=".25" />}
  </svg>;
}
