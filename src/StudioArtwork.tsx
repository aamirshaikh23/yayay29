import { useId } from 'react';
import { furnishingRole } from './studioModel';
import type { Design, Furnishing } from './studioModel';
import { projectFloor, scenePlacement, SCENE_HEIGHT, SCENE_VIEWBOX, SCENE_WIDTH } from './studioView';
import { MaterialDefs } from './MaterialFinish';

export function FurnishingArt({ item }: { item: Furnishing }) {
  const id = useId().replace(/:/g, '');
  const { kind, color, accent, shape, detail } = item;
  const radius = shape === 'Square' ? 1 : shape === 'Round' ? 22 : 10;
  const fill = `url(#surface-${id})`;
  const accentFill = `url(#accent-${id})`;
  const legs = <path d="m18 73-5 24m69-24 5 24" fill="none" strokeWidth="5" />;
  let artwork;
  switch (kind) {
    case 'bentwood': case 'canechair':
      artwork = <>{legs}<path d="M12 63V28Q12 4 50 4t38 24v35" fill="none" strokeWidth="6" />
        <path d="M24 55V29q0-15 26-15t26 15v26z" fill={fill} />
        {kind === 'bentwood' ? <path d="M50 17v38M33 21l17 30 17-30" fill="none" strokeWidth="3" /> : <path d="M30 22v31m10-35v35m10-35v35m10-35v35m10-31v31M25 29h50m-50 9h50m-50 9h50" strokeWidth="1" />}
        <ellipse cx="50" cy="65" rx="43" ry="12" fill={fill} /><path d="M8 67v8q42 15 84 0v-8" fill={fill} /></>;
      break;
    case 'tubchair':
      artwork = <>{legs}<path d="M5 66V32Q5 3 50 3t45 29v34l-12 17H17z" fill={fill} /><path d="M16 40q34 20 68 0v28q-34 20-68 0z" fill={fill} /><path d="M13 32v36m74-36v36" fill="none" strokeWidth="5" /></>;
      break;
    case 'ottoman':
      artwork = <><path d="M5 29v47q0 22 45 22t45-22V29z" fill={fill} /><ellipse cx="50" cy="29" rx="45" ry="24" fill={fill} /><path d="M8 49q42 24 84 0M50 8v40" fill="none" opacity=".5" /><circle cx="50" cy="29" r="3" fill={accent} /></>;
      break;
    case 'coffeetable':
      artwork = <>{legs}<path d="M3 19 85 9l13 22-83 12z" fill={fill} /><path d="M15 43v8l83-12v-8M3 19v8l12 24" fill={accent} /><path d="M19 48v36m65-44v44" strokeWidth="5" /></>;
      break;
    case 'kettle':
      artwork = <><path d="M30 46q-9-33 20-33t20 33" fill="none" strokeWidth="7" /><path d="M17 56q33-35 60 0l6 30q-35 20-70 0z" fill={fill} /><path d="M20 66Q-8 65 3 28l9-10" fill="none" strokeWidth="6" /><ellipse cx="48" cy="48" rx="18" ry="6" fill={accent} /><path d="M48 40v7" strokeWidth="4" /></>;
      break;
    case 'dripper':
      artwork = <><path d="M7 92h86M20 92V10h60v82" fill="none" strokeWidth="5" /><path d="M25 19h50L57 53H43z" fill={fill} /><path d="M34 59h32l8 27q-24 13-48 0z" fill={fill} /><path d="M44 58v10h12V58" fill={accent} /></>;
      break;
    case 'toaster':
      artwork = <><rect x="4" y="20" width="92" height="70" rx={radius} fill={fill} /><ellipse cx="45" cy="20" rx="35" ry="11" fill={fill} /><path d="M22 17h45m-45 8h45M85 35v33" strokeWidth="4" /><circle cx="82" cy="77" r="5" fill={accent} /><path d="M14 94h72" strokeWidth="4" /></>;
      break;
    case 'tray':
      artwork = <><path d="M7 25h86l-6 55H13z" fill={fill} /><path d="M16 33h68l-5 37H21z" fill={fill} /><path d="M9 35H1v26h11m77-26h10v26H88" fill="none" strokeWidth="4" /></>;
      break;
    case 'candle':
      artwork = <><rect x="24" y="35" width="52" height="60" rx="5" fill={fill} /><ellipse cx="50" cy="35" rx="26" ry="7" fill={fill} /><path d="M50 36v-9" /><path d="M50 4q-18 17 0 23Q63 20 50 4" fill="#efb95f" stroke="#cf9951" /></>;
      break;
    case 'sculpture':
      artwork = <><path d="M24 86V36q0-31 26-31t26 31v50H59V35q0-13-9-13t-9 13v51z" fill={fill} /><path d="M10 89h80v8H10z" fill={fill} /></>;
      break;
    case 'basket':
      artwork = <><path d="M25 32q0-50 50 0" fill="none" strokeWidth="6" /><path d="M6 32h88l-9 63H15z" fill={fill} /><path d="M12 48h76m-74 14h72m-69 14h66m-61-40 7 54m13-54 2 54m14-54-2 54m17-54-8 54" fill="none" opacity=".5" /></>;
      break;
    case 'recordplayer':
      artwork = <><path d="M4 28h92v64H4z" fill={fill} /><path d="M9 6h82v25H9z" fill={fill} /><ellipse cx="43" cy="51" rx="30" ry="17" fill={accent} /><ellipse cx="43" cy="51" rx="9" ry="5" fill={color} /><path d="M82 34v24l-18 9" fill="none" strokeWidth="3" /><circle cx="81" cy="79" r="4" fill={accent} /></>;
      break;
    case 'tablelamp':
      artwork = <><ellipse cx="50" cy="94" rx="29" ry="5" fill={fill} /><path d="M42 43h16l8 49H34z" fill={fill} /><path d="M3 44Q3 3 50 3t47 41z" fill={fill} /><ellipse cx="50" cy="44" rx="47" ry="5" fill={item.lightPower ? (item.lightWarmth > 50 ? '#ffe4a0' : '#d4eaff') : accent} /><ellipse cx="50" cy="56" rx="50" ry="20" fill="#ffdd94" fillOpacity={item.lightPower / 500} stroke="none" /></>;
      break;
    case 'chair': case 'armchair': case 'sofa': case 'bench':
      artwork = <>{legs}<rect x="10" y="5" width="80" height="65" rx={radius} fill={fill} />
        <rect x="17" y="12" width="66" height="42" rx={radius / 2} fill={color} fillOpacity=".45" />
        <path d="M10 60q40-13 80 0v19q-40 9-80 0z" fill={fill} />
        {['sofa', 'bench'].includes(kind) && <path d="M50 13v40m0 9v15" fill="none" opacity=".55" />}
        {['armchair', 'sofa'].includes(kind) && <><rect x="2" y="40" width="14" height="39" rx="6" fill={fill} /><rect x="84" y="40" width="14" height="39" rx="6" fill={fill} /></>}
        {detail > 60 && <path d="M24 24h52m-52 15h52" opacity=".3" />}
        <path d="M12 65q38-11 76 0" fill="none" stroke="#fff5df" strokeOpacity=".5" /></>;
      break;
    case 'table': case 'dining': case 'side': case 'outdoor':
      artwork = <>{kind === 'dining' ? legs : <><path d="M47 24h7v61l22 10H25l22-10z" fill={accent} /><ellipse cx="50" cy="94" rx="28" ry="3" fill={accent} /></>}
        {shape === 'Round' ? <><ellipse cx="50" cy="26" rx="48" ry="18" fill={accent} /><ellipse cx="50" cy="20" rx="48" ry="18" fill={fill} /></> : <><path d="m3 8 82-6 13 25-83 8z" fill={fill} /><path d="m15 35 83-8v7L15 42 3 16V8z" fill={accent} /><path d="m3 8 12 27 83-8" fill="none" /></>}
        {detail > 40 && <path d="M23 18q24-9 49 0" fill="none" stroke="#fff9e6" strokeOpacity=".65" />}</>;
      break;
    case 'stool':
      artwork = <><path d="m25 20-10 76m60-76 10 76M19 70h62" fill="none" strokeWidth="5" /><ellipse cx="50" cy="20" rx="43" ry="15" fill={accent} /><ellipse cx="50" cy="15" rx="43" ry="14" fill={fill} /></>;
      break;
    case 'counter': case 'cabinet':
      artwork = <><path d="M5 22h90v72H5z" fill={fill} /><path d="M5 25h90v66H5z" fill={accent} fillOpacity=".3" />
        {[25, 50, 75].map((x) => <g key={x}><path d={`M${x} 31v56`} strokeWidth=".8" /><path d={`M${x - 11} 39h6`} strokeWidth="2" /></g>)}
        <path d="m2 17 89-9 8 13-91 9z" fill={fill} /><path d="M8 30v5l91-8v-6" fill={accent} /><path d="M9 92h84" strokeWidth="4" /></>;
      break;
    case 'machine':
      artwork = <><rect x="5" y="8" width="90" height="65" rx={radius} fill={fill} /><path d="M10 13h78" stroke="#fff8e4" strokeOpacity=".6" strokeWidth="4" />
        <rect x="12" y="54" width="76" height="36" rx="3" fill={accent} /><path d="M18 82h65m-65 5h65" stroke={color} />
        {[30, 67].map((x) => <g key={x}><circle cx={x} cy="30" r="10" fill="#faf2dc" /><path d={`M${x} 30l4-5M${x} 49v14`} /><path d={`M${x - 8} 64h16l-2 12h-12z`} fill="#fff3db" /></g>)}
        <path d="M91 46v28" strokeWidth="4" /><path d="M5 92h90" strokeWidth="4" /></>;
      break;
    case 'grinder':
      artwork = <><path d="M23 7h54l-9 34H32z" fill={color} fillOpacity=".65" /><ellipse cx="50" cy="7" rx="27" ry="5" fill={accent} /><path d="M35 41h30v16H35z" fill={accent} />
        <rect x="20" y="57" width="60" height="36" rx="6" fill={fill} /><path d="M50 49v21m-13 5h26l-3 15H40z" fill={accent} /></>;
      break;
    case 'display':
      artwork = <><path d="M3 19 88 8l9 15v64L3 95z" fill={color} fillOpacity=".6" /><path d="M3 19 88 8v66L3 85z" fill={color} fillOpacity=".6" />
        <path d="M3 19v76l94-8V23L88 8M3 85l94-9M4 51l85-10" fill="none" strokeWidth="3" />
        {[37, 70].map((y) => <g key={y}>{[19, 44, 69].map((x) => <path key={x} d={`M${x - 8} ${y}q8-17 16-2l-2 7h-13z`} fill="#d2a06b" stroke="#ae7d51" />)}</g>)}
        <path d="M15 24l21 49m10-52 20 48" stroke="#fff" strokeWidth="4" strokeOpacity=".55" /><path d="m3 95 94-8v-9L3 87z" fill={accent} /></>;
      break;
    case 'sink':
      artwork = <><path d="m5 56 70-12 21 24-70 17z" fill={fill} /><ellipse cx="51" cy="65" rx="28" ry="12" fill={accent} /><path d="M64 54V28q0-24-17-17-9 5-9 18" fill="none" stroke={accent} strokeWidth="6" /></>;
      break;
    case 'fridge':
      artwork = <><rect x="8" y="3" width="84" height="92" rx={radius} fill={fill} /><path d="M12 20h76m-66 12v28" strokeWidth="3" /><path d="M20 85h60m-60 4h60" opacity=".5" /><path d="M16 98v-4m68 4v-4" strokeWidth="4" /></>;
      break;
    case 'shelf':
      artwork = <><path d="M5 97V19Q5 3 22 3h56q17 0 17 16v78z" fill={fill} />
        {[28, 57, 86].map((y) => <g key={y}><path d={`M10 ${y}h80`} strokeWidth="4" />
          {[23, 49, 75].map((x) => <g key={x}><path d={`M${x - 8} ${y - 19}h14l-2 15h-10z`} fill="#fff1d7" /><path d={`M${x + 6} ${y - 17}q12 0 3 9h-5`} fill="none" /></g>)}</g>)}</>;
      break;
    case 'door':
      artwork = <><path d={`M5 98V26Q5 3 28 3h44q23 0 23 23v72z`} fill={accent} /><path d="M12 98V27q0-17 17-17h42q17 0 17 17v71z" fill={fill} />
        <path d="M20 21h60v38H20z" fill="#cbded2" fillOpacity=".75" /><path d="M50 21v38M20 40h60" stroke={accent} />
        <path d="M20 69h25v22H20zm35 0h25v22H55z" fill="none" /><circle cx="78" cy="64" r="2" fill={accent} /></>;
      break;
    case 'window':
      artwork = <><rect x="3" y="3" width="94" height="94" rx={radius / 2} fill={accent} /><rect x="8" y="8" width="84" height="78" fill={color} />
        <path d="M8 71q9-36 24-13 10-49 25-24 16-36 35-5v57H8z" fill="#a5bb8b" stroke="none" opacity=".75" />
        <path d="M8 44h84M36 8v78m28-78v78" stroke={accent} strokeWidth="3" /><path d="M5 3h16L13 86H5zm74 0h16v83h-8z" fill={accent} />
        <path d="M29 15 40 33m15 17 14 23" stroke="#fff" strokeWidth="3" strokeOpacity=".5" /><path d="M0 90h100v8H0z" fill={fill} /></>;
      break;
    case 'partition':
      artwork = <><path d="M2 9h96v7H2zm0 77h96v9H2z" fill={accent} />{Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 10 + 3} y="5" width="5" height="90" fill={fill} />)}</>;
      break;
    case 'pendant': case 'sconce': case 'lamp': {
      const glow = item.lightWarmth > 50 ? '#ffd178' : '#d4eaff';
      artwork = <><ellipse cx="50" cy={kind === 'lamp' ? 25 : 64} rx="65" ry="48" fill={glow} fillOpacity={item.lightPower / 350} stroke="none" />
        {kind === 'lamp' ? <><path d="M50 30v64m-25 3h50" strokeWidth="4" /><path d="M30 4h40l15 30H15z" fill={fill} /><ellipse cx="50" cy="34" rx="35" ry="4" fill={item.lightPower ? glow : accent} /></>
          : <><path d={kind === 'pendant' ? 'M50 0v39' : 'M25 25h25v14'} fill="none" strokeWidth="3" /><path d="M24 64q2-26 26-26t26 26l12 15H12z" fill={fill} /><ellipse cx="50" cy="79" rx="38" ry="5" fill={item.lightPower === 0 ? accent : item.lightWarmth > 50 ? '#fff0b7' : '#ecf7ff'} /></>}
        {detail > 60 && <path d="M33 44q17-7 34 0" fill="none" opacity=".4" />}</>;
      break;
    }
    case 'plant': case 'planter':
      artwork = <><path d="M50 75V20M48 53 24 30m28 26 25-29M50 62 17 49" stroke={color} strokeWidth="2" fill="none" />
        {[[25, 29, -45], [50, 20, 0], [75, 29, 45], [20, 50, -65], [77, 50, 65]].slice(0, detail < 25 ? 3 : 5).map(([x, y, angle]) => <ellipse key={x} cx={x} cy={y} rx="10" ry="23" transform={`rotate(${angle} ${x} ${y})`} fill={color} stroke="#657955" />)}
        <path d={kind === 'planter' ? 'M2 67h96l-5 29H7z' : 'M28 66h44l-7 31H35z'} fill={accentFill} /><path d={kind === 'planter' ? 'M0 66h100v7H0z' : 'M25 65h50v8H25z'} fill={accentFill} /><path d="M35 78h29" stroke="#fff2d6" strokeOpacity=".4" /></>;
      break;
    case 'rug':
      artwork = <><rect x="2" y="8" width="96" height="84" rx={radius} fill={fill} /><rect x="10" y="16" width="80" height="68" rx={radius / 2} fill="none" strokeWidth="3" />
        {detail > 30 && <><path d="m50 22 25 28-25 28-25-28z" fill={accent} fillOpacity=".45" />{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${6 + i * 8} 2v7m0 82v7`} />)}</>}</>;
      break;
    case 'vase':
      artwork = <><path d="M50 63 26 17m25 47 5-56m-4 55 28-37" fill="none" stroke="#829469" strokeWidth="3" />
        {[[26, 17], [56, 10], [80, 27]].map(([x, y]) => <g key={x}><path d={`M${x} ${y - 9}q15-9 11 5 13 10-3 13-8 12-15-2-14-6-3-15z`} fill={color} /><circle cx={x} cy={y} r="4" fill="#e1be73" /></g>)}
        <path d="M34 59h32l7 27q1 12-23 12T27 86z" fill={accentFill} /><path d="M37 67v19" stroke="#fff6df" strokeOpacity=".45" strokeWidth="3" /></>;
      break;
    case 'art': case 'mirror':
      artwork = <><rect x="4" y="3" width="92" height="94" rx={radius} fill={accentFill} /><rect x="11" y="10" width="78" height="80" rx={radius / 2} fill={kind === 'mirror' ? fill : '#f5e5c4'} />
        {kind === 'art' ? <><circle cx="63" cy="36" r="16" fill={color} /><path d="M18 81q12-43 34-20l30 20" fill={color} /><path d="M35 79q5-17 15-24" fill="none" /></> : <path d="m25 68 43-43M40 77l33-32" stroke="#fff" strokeOpacity=".6" strokeWidth="5" />}</>;
      break;
    case 'books':
      artwork = <>{[0, 1, 2].map((i) => <g key={i} transform={`translate(${i * 4} ${-i * 24})`}><path d="M3 74h82v19H3z" fill={i % 2 ? accent : fill} /><path d="M9 80h70v7H9z" fill="#f3e7d0" /><path d="M13 81h60m-60 4h60" strokeWidth=".5" /></g>)}</>;
      break;
    case 'cups':
      artwork = <><ellipse cx="48" cy="89" rx="46" ry="8" fill={fill} /><path d="M74 32q34-4 20 33-5 9-20 4" fill="none" strokeWidth="6" /><path d="M14 30h62l-8 49q-24 18-46 0z" fill={fill} />
        <ellipse cx="45" cy="30" rx="31" ry="9" fill={accent} /><path d="M33 30q12-12 24 0-12 12-24 0" fill="#f3e8d0" stroke="none" /></>;
      break;
    case 'cushion':
      artwork = <><path d="M8 14q40 8 84 0-10 36 0 74-43-9-84 0 10-39 0-74z" fill={fill} /><path d="M17 23q32 8 66 0-7 26 0 56-33-7-66 0 6-29 0-56z" fill="none" opacity=".4" /><circle cx="50" cy="50" r="3" fill={accent} /></>;
      break;
    case 'clock':
      artwork = <><circle cx="50" cy="50" r="46" fill={fill} /><circle cx="50" cy="50" r="38" fill="none" /><path d="M50 20v5m0 50v5M20 50h5m50 0h5M50 30v20l19 11" strokeWidth="3" /></>;
      break;
    case 'menu': case 'sign':
      artwork = <><rect x="3" y="3" width="94" height="94" rx={radius} fill={accentFill} /><rect x="9" y="9" width="82" height="82" rx={radius / 2} fill={kind === 'menu' ? fill : accentFill} />
        {item.text.split('\n').slice(0, 7).map((line, i, lines) => <text key={i} x="50" y={50 - (lines.length - 1) * 7 + i * 14} fill={kind === 'menu' ? accent : color} stroke="none" fontSize={kind === 'menu' ? 10 : 14} textAnchor="middle" dominantBaseline="middle" fontFamily={item.font}>{line}</text>)}</>;
      break;
    case 'umbrella':
      artwork = <><path d="M50 15v82m-21 0h42" strokeWidth="3" /><path d="M3 27Q50-15 97 27l-7 6-12-5-14 6-14-6-14 6-13-6-13 5z" fill={fill} /><path d="M50 3 23 28m27-25 28 25M50 3v25" fill="none" stroke={accent} /></>;
      break;
    default: artwork = <rect x="5" y="5" width="90" height="90" rx={radius} fill={fill} />;
  }
  return <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" overflow="visible" aria-hidden="true">
    <MaterialDefs id={id} material={item.material} color={color} accent={accent} pattern={item.pattern} />
    <g stroke={accent} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" data-material={item.material} data-role={furnishingRole(kind)}>{artwork}</g>
  </svg>;
}

export function RoomArtwork({ design, grid }: { design: Design; grid: boolean }) {
  const id = useId().replace(/:/g, '');
  const r = design.room;
  const size = r.floorScale;
  const floor = '180,390 1020,390 1200,690 0,690';
  return <>
    <defs>
      <pattern id={`floor-${id}`} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform="matrix(1 0 -.5 .55 0 390)">
        <rect width={size} height={size} fill={r.floor} />
        {r.floorStyle === 'Planks' && <path d={`M0 0h${size}v${size}M0 ${size / 2}h${size / 2}V0m0 ${size / 2}v${size / 2}`} fill="none" stroke={r.floorAccent} strokeWidth="1.5" />}
        {r.floorStyle === 'Tiles' && <rect x="1" y="1" width={size - 2} height={size - 2} fill="none" stroke={r.floorAccent} strokeWidth="2" />}
        {r.floorStyle === 'Checkerboard' && <g fill={r.floorAccent}><rect width={size / 2} height={size / 2} /><rect x={size / 2} y={size / 2} width={size / 2} height={size / 2} /></g>}
        {r.floorStyle === 'Herringbone' && <path d={`M0 0l${size} ${size}m-${size} 0L${size} 0M0 ${size / 2}l${size / 2} ${-size / 2}m0 ${size} ${size / 2} ${-size / 2}`} stroke={r.floorAccent} strokeWidth="2" />}
        {r.floorStyle === 'Terrazzo' && <g fill={r.floorAccent}><path d={`m5 5 9 3-5 8zM${size / 2} ${size / 2}l12-5-3 12z`} /><circle cx={size - 8} cy="14" r="3" /><circle cx="14" cy={size - 8} r="4" /></g>}
      </pattern>
      <pattern id={`wall-${id}`} width="60" height="80" patternUnits="userSpaceOnUse">
        <rect width="60" height="80" fill={r.wall} />
        {r.wallStyle === 'Brick' && <path d="M0 0h60v40H0zm30 0v20M0 20h60M10 20v20M0 40h60v40H0zm30 0v20M0 60h60M10 60v20" fill="none" stroke={r.trim} strokeOpacity=".4" strokeWidth="2" />}
        {r.wallStyle === 'Stripes' && <rect width="15" height="80" fill={r.trim} opacity=".18" />}
        {r.wallStyle === 'Paneling' && <rect x="5" y="8" width="50" height="64" rx="2" fill="none" stroke={r.trim} strokeOpacity=".45" />}
      </pattern>
      <linearGradient id={`daylight-${id}`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#fff8d9" stopOpacity=".4" /><stop offset="1" stopColor="#fff8d9" stopOpacity="0" /></linearGradient>
    </defs>
    <rect width={SCENE_WIDTH} height={SCENE_HEIGHT} fill={r.wall} />
    <rect x="180" width="840" height="398" fill={`url(#wall-${id})`} />
    <path d="M0 0h180v390L0 690zm1020 0h180v690l-180-300z" fill={`url(#wall-${id})`} />
    <path d="M0 0h180v390L0 690z" fill="#fff8db" opacity=".18" /><path d="M1020 0h180v690l-180-300z" fill={r.trim} opacity=".12" />
    <polygon points={floor} fill={`url(#floor-${id})`} />
    <path d="M0 690 180 390h840l180 300M180 0v390m840-390v390" fill="none" stroke={r.trim} strokeWidth="3" />
    <path d="M0 672 180 376h840l180 296" fill="none" stroke={r.trim} strokeWidth="10" />
    <path d="M0 663 180 369h840l180 294" fill="none" stroke="#fff6df" strokeOpacity=".6" strokeWidth="3" />
    <rect width="1200" height="12" fill={r.trim} /><path d="M0 18h1200" stroke={r.trim} strokeWidth="2" />
    <rect x="185" y="24" width="830" height={28 + r.wallHeight / 5} rx="4" fill={r.facade} />
    {r.awningStyle !== 'None' && <g>
      <rect x="190" y="28" width="820" height="23" fill={r.awning} />
      {r.awningStyle === 'Striped' && Array.from({ length: 28 }, (_, i) => <path key={i} d={`M${190 + i * 29.3} 28h14.65v23q-7 8-14.65 0z`} fill={r.facade} />)}
    </g>}
    <rect x="430" y="72" width="340" height="56" rx="9" fill={r.wall} stroke={r.trim} strokeWidth="3" />
    <rect x="437" y="79" width="326" height="42" rx="5" fill="none" stroke={r.trim} strokeOpacity=".4" />
    <text x="600" y="107" textAnchor="middle" fontFamily={r.font} fontSize={Math.min(24, 450 / Math.max(12, r.name.length))} fill={r.trim}>{r.name}</text>
    <path d="m0 220 470-90-140 480L0 680z" fill={`url(#daylight-${id})`} pointerEvents="none" />
    {grid && <g data-editor="true" pointerEvents="none" stroke={r.trim} strokeOpacity=".4" strokeWidth="1">
      {Array.from({ length: 19 }, (_, i) => { const a = projectFloor(r.width * i / 18, 0, r); const b = projectFloor(r.width * i / 18, r.depth, r); return <path key={`x-${i}`} d={`M${a.x} ${a.y} ${b.x} ${b.y}`} />; })}
      {Array.from({ length: 13 }, (_, i) => { const a = projectFloor(0, r.depth * i / 12, r); const b = projectFloor(r.width, r.depth * i / 12, r); return <path key={`y-${i}`} d={`M${a.x} ${a.y} ${b.x} ${b.y}`} />; })}
    </g>}
    <path d="M0 704h1200" stroke={r.trim} strokeOpacity=".3" />
    <text x="600" y="717" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill={r.trim}>{(r.width / 100).toFixed(1)} m wide / {(r.depth / 100).toFixed(1)} m deep</text>
  </>;
}

export function PlacedFurnishing({ item, design }: { item: Furnishing; design: Design }) {
  const p = scenePlacement(item, design);
  if (item.kind === 'rug') {
    const floor = projectFloor(item.x, item.y, design.room);
    return <g transform={`translate(${floor.x} ${floor.y}) scale(1 .36) rotate(${item.rotation})`} opacity={item.opacity / 100}>
      <svg x={-p.width / 2} y={-item.depth * p.scale / 2} width={p.width} height={item.depth * p.scale} overflow="visible"><FurnishingArt item={item} /></svg>
    </g>;
  }
  return <g transform={`translate(${p.x} ${p.y})`} opacity={item.opacity / 100} data-kind={item.kind}>
    {!['window', 'art', 'mirror', 'menu', 'sign', 'clock', 'sconce', 'shelf', 'pendant'].includes(item.kind) && <ellipse cy="1" rx={p.width * .48} ry={Math.min(12, item.depth * p.scale * .12)} fill="#725741" opacity=".12" stroke="none" />}
    <g transform={`scale(${p.mirror} 1)`}>
      <svg x={-p.width / 2} y={-p.height} width={p.width} height={p.height} overflow="visible"><FurnishingArt item={item} /></svg>
    </g>
  </g>;
}

export function RoomAtmosphere({ room }: { room: Design['room'] }) {
  return <>
    <rect width={SCENE_WIDTH} height={SCENE_HEIGHT} fill={room.night ? '#172b39' : '#252d25'} opacity={(100 - room.light) / 230 + (room.night ? .2 : 0)} pointerEvents="none" />
    <rect width={SCENE_WIDTH} height={SCENE_HEIGHT} fill="#ffc16b" opacity={room.warmth / 650} pointerEvents="none" />
  </>;
}

export function DesignScene({ design, className }: { design: Design; className?: string }) {
  return <svg className={className} viewBox={SCENE_VIEWBOX} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <RoomArtwork design={design} grid={false} />
    {design.items.filter((item) => !item.hidden).map((item) => <PlacedFurnishing key={item.id} item={item} design={design} />)}
    <RoomAtmosphere room={design.room} />
  </svg>;
}
