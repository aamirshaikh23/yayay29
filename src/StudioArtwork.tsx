import { useId } from 'react';
import { catalog, designAreas, framePanels, furnishingRole, isPlant, PLANT_POT_COLOR } from './studioModel';
import type { Design, Furnishing } from './studioModel';
import { projectFloor, scenePlacement, SCENE_HEIGHT, SCENE_VIEWBOX, SCENE_WIDTH } from './studioView';
import { MaterialDefs } from './MaterialFinish';
import { isOutdoorFloorStyle, OutdoorFloorTile } from './FloorFinish';

export function FurnishingArt({ item, aspect = 1 }: { item: Furnishing; aspect?: number }) {
  const id = useId().replace(/:/g, '');
  const { color, shape, detail } = item;
  const accent = isPlant(item.kind) ? PLANT_POT_COLOR : item.accent;
  const kind = catalog.find((entry) => entry.kind === item.kind)?.style ?? item.kind;
  const radius = shape === 'Square' ? 1 : shape === 'Round' ? 22 : 10;
  const fill = `url(#surface-${id})`;
  const accentFill = isPlant(item.kind) ? PLANT_POT_COLOR : `url(#accent-${id})`;
  const legFill = item.legColor !== undefined || item.legMaterial !== undefined ? `url(#surface-legs-${id})` : accentFill;
  const legs = <path d="m18 73-5 24m69-24 5 24" fill="none" stroke={legFill} strokeWidth="5" />;
  const bulb = item.lightPower === 0 ? accent : item.lightWarmth > 50 ? '#ffe4a0' : '#d4eaff';
  const lettering = <>{item.text.split('\n').slice(0, 7).map((line, i, lines) => <text key={i} x="50" y={50 - (lines.length - 1) * 7 + i * 14} fill={color} stroke="none" fontSize="10" textAnchor="middle" fontFamily={item.font}>{line}</text>)}</>;
  let artwork;
  switch (kind) {
    case 'spindle':
      artwork = <>{legs}<path d="M10 62V13q40-20 80 0v49" fill="none" strokeWidth="5" />{[25, 40, 60, 75].map((x) => <path key={x} d={`M${x} 12v47`} strokeWidth="3" />)}<path d="M7 62q43-14 86 0v15H7z" fill={fill} /></>;
      break;
    case 'wingback':
      artwork = <>{legs}<path d="M15 65 4 12l18 8Q50-8 78 20l18-8-11 53v19H15z" fill={fill} /><path d="M22 24v39q28-12 56 0V24M17 73h66" fill="none" /><path d="M8 53h15v25H8zm69 0h15v25H77z" fill={accentFill} /></>;
      break;
    case 'booth':
      artwork = <>{legs}<rect x="4" y="3" width="92" height="90" rx={radius} fill={fill} />{[20, 35, 50, 65, 80].map((x) => <path key={x} d={`M${x} 8v55`} opacity=".55" />)}<path d="M5 68q45-10 90 0v14H5z" fill={fill} /><path d="M6 85h88v12H6z" fill={legFill} /></>;
      break;
    case 'console':
      artwork = <>{legs}<path d="M6 22h88v22H6z" fill={fill} /><path d="M3 16h94v9H3z" fill={fill} /><path d="M50 25v17M28 34h8m28 0h8M17 79h67" strokeWidth="2" /></>;
      break;
    case 'nesting':
      artwork = <><path d="M9 29v66m57-66v66" stroke={legFill} strokeWidth="4" /><ellipse cx="38" cy="27" rx="36" ry="17" fill={fill} /><path d="M42 61v36m48-36v36" stroke={legFill} strokeWidth="4" /><ellipse cx="66" cy="59" rx="31" ry="15" fill={accentFill} /></>;
      break;
    case 'plinth':
      artwork = <><path d="M11 18h78v78H11z" fill={item.legColor !== undefined || item.legMaterial !== undefined ? legFill : fill} /><ellipse cx="50" cy="18" rx="39" ry="14" fill={fill} />{[22, 36, 50, 64, 78].map((x) => <path key={x} d={`M${x} 32v59`} opacity=".35" />)}</>;
      break;
    case 'blender':
      artwork = <><path d="M25 13h50l-5 49H30z" fill={fill} /><path d="M75 21q30-3 15 30H72" fill="none" strokeWidth="5" /><path d="M20 6h60v9H20zm13 56h34l13 33H20z" fill={accentFill} /><path d="M30 43h40l-3 14H33z" fill={color} opacity=".7" /><circle cx="50" cy="80" r="7" fill={fill} /></>;
      break;
    case 'teapot':
      artwork = <><path d="M29 36q-20 10-17 35 6 25 38 25t38-25q3-25-17-35z" fill={fill} /><path d="M17 60 2 28l26 17m55 2q34-4 9 30" fill="none" strokeWidth="7" /><ellipse cx="50" cy="36" rx="24" ry="6" fill={accentFill} /><circle cx="50" cy="27" r="5" fill={fill} /></>;
      break;
    case 'scale':
      artwork = <><path d="M4 20h92v73H4z" fill={fill} /><path d="M11 26h78v38H11z" fill={accentFill} /><rect x="20" y="73" width="36" height="13" fill="#b9d1a8" /><text x="38" y="83" fontSize="10" textAnchor="middle" stroke="none" fill="#334732">0.00</text><circle cx="78" cy="79" r="6" fill={accent} /></>;
      break;
    case 'oven':
      artwork = <><rect x="3" y="8" width="94" height="84" rx="5" fill={fill} /><rect x="10" y="19" width="62" height="58" rx="3" fill={accentFill} /><path d="M15 29h52m-52 34h52m-52-18h52" stroke={color} /><path d="m20 61 10-15 12 15zm22 0 10-15 12 15z" fill="#d9aa6b" />{[30, 55, 79].map((y) => <circle key={y} cx="84" cy={y} r="5" fill={accent} />)}</>;
      break;
    case 'dispenser':
      artwork = <><path d="M24 13h52v65H24z" fill={fill} /><ellipse cx="50" cy="12" rx="26" ry="7" fill={accentFill} /><path d="M28 36h44v30H28z" fill="#aacdad" opacity=".6" /><circle cx="43" cy="47" r="8" fill="#e1ce72" /><circle cx="59" cy="56" r="7" fill="#c6d57e" /><path d="M50 68v12h17v8" fill="none" strokeWidth="5" /><path d="M20 95h60l-6-12H26z" fill={accentFill} /></>;
      break;
    case 'jar':
      artwork = <><rect x="17" y="16" width="66" height="78" rx="9" fill={fill} /><rect x="14" y="6" width="72" height="15" rx="4" fill={accentFill} />{Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={29 + i % 3 * 20} cy={48 + Math.floor(i / 3) * 12} rx="7" ry="4" fill={accent} />)}<rect x="26" y="25" width="48" height="20" rx="3" fill="#eee2c9" /></>;
      break;
    case 'tins':
      artwork = <>{[2, 35, 68].map((x, i) => <g key={x}><rect x={x} y={15 + i * 8} width="29" height={78 - i * 8} rx="4" fill={i % 2 ? accentFill : fill} /><ellipse cx={x + 14} cy={15 + i * 8} rx="14" ry="6" fill={accentFill} /><rect x={x + 5} y="50" width="19" height="21" fill="#efdfbc" /><path d={`M${x + 9} 57h11m-11 7h11`} strokeWidth="1" /></g>)}</>;
      break;
    case 'bakeryrack':
      artwork = <><path d="M5 98V8h90v90" fill="none" strokeWidth="5" />{[30, 58, 86].map((y) => <g key={y}><path d={`M7 ${y}h86`} strokeWidth="4" />{[23, 50, 77].map((x) => <path key={x} d={`M${x - 10} ${y - 4}q10-28 20 0z`} fill={fill} />)}</g>)}</>;
      break;
    case 'archway':
      artwork = <><path d="M4 98V35Q4 2 50 2t46 33v63H77V36q0-20-27-20T23 36v62z" fill={fill} /><path d="M23 98V36q0-20 27-20t27 20v62" fill="#6b705c" fillOpacity=".2" /></>;
      break;
    case 'frenchdoor':
      artwork = <><rect x="3" y="3" width="94" height="95" rx={radius / 2} fill={fill} />{[12, 55].map((x) => <g key={x}><rect x={x} y="12" width="33" height="69" fill="#c3d9d0" /><path d={`M${x} 35h33m-33 23h33m-17-46v69`} /><rect x={x} y="86" width="33" height="6" fill="none" /></g>)}<path d="M47 54v10m6-10v10" strokeWidth="3" /></>;
      break;
    case 'archedwindow':
      artwork = <><path d="M5 96V38Q5 3 50 3t45 35v58z" fill={accentFill} /><path d="M13 88V39q0-28 37-28t37 28v49z" fill={fill} /><path d="M50 12v77M13 46h74M13 69h74M24 23l26 23 25-23" fill="none" /></>;
      break;
    case 'curtains':
      artwork = <><path d="M2 5h96" strokeWidth="5" /><path d="M4 8h40L32 91l-30 6zm52 0h40l2 89-30-6z" fill={fill} />{[10, 21, 33, 65, 77, 89].map((x) => <path key={x} d={`M${x} 12q-5 42 0 79`} fill="none" opacity=".45" />)}</>;
      break;
    case 'column':
      artwork = <><path d="M20 13h60v74H20z" fill={fill} /><path d="M8 3h84v12H8zm0 83h84v12H8z" fill={accentFill} />{[30, 43, 57, 70].map((x) => <path key={x} d={`M${x} 19v62`} strokeWidth="3" opacity=".4" />)}</>;
      break;
    case 'wallpanel': case 'glassdivider':
      artwork = <><rect x="4" y="2" width="92" height="96" rx="3" fill={fill} />{kind === 'wallpanel' ? <><rect x="12" y="10" width="76" height="78" rx={radius / 2} fill="none" strokeWidth="3" /><rect x="20" y="19" width="60" height="60" fill="none" /></> : <>{Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${10 + i * 8} 5v90`} strokeWidth="2" opacity=".6" />)}<path d="M4 3h92v94H4z" fill="none" strokeWidth="4" /></>}</>;
      break;
    case 'globe': case 'lantern':
      artwork = <><path d="M50 0v25" strokeWidth="3" /><ellipse cx="50" cy="58" rx="43" ry="33" fill={fill} /><ellipse cx="50" cy="65" rx="30" ry="22" fill={bulb} opacity={item.lightPower / 220} stroke="none" />
        {kind === 'lantern' && [35, 45, 55, 65, 75, 85].map((y) => <path key={y} d={`M13 ${y}h74`} opacity=".45" />)}<path d="M39 25h22M39 91h22" strokeWidth="3" /></>;
      break;
    case 'chandelier':
      artwork = <><path d="M50 0v48M9 48h82M14 48v15m36-15v25m36-25v15" fill="none" strokeWidth="4" />{[16, 50, 84].map((x) => <g key={x}><circle cx={x} cy={x === 50 ? 82 : 72} r="14" fill={fill} /><circle cx={x} cy={x === 50 ? 82 : 72} r="10" fill={bulb} opacity={item.lightPower / 170} stroke="none" /></g>)}</>;
      break;
    case 'tracklight':
      artwork = <><path d="M2 19h96" strokeWidth="6" />{[18, 50, 82].map((x) => <g key={x}><path d={`M${x} 19v21`} strokeWidth="3" /><path d={`m${x - 12} 40 20-8 8 35-20 7z`} fill={fill} /><ellipse cx={x + 5} cy="70" rx="11" ry="5" fill={bulb} /></g>)}</>;
      break;
    case 'arclamp':
      artwork = <><path d="M10 97h32M22 94V36Q22 1 77 17v18" fill="none" strokeWidth="4" /><path d="M55 46q0-19 22-19t22 19z" fill={fill} /><ellipse cx="77" cy="46" rx="21" ry="4" fill={bulb} /></>;
      break;
    case 'doublesconce':
      artwork = <><path d="M42 35h16v33H42z" fill={accentFill} /><path d="M50 47H17V25m33 22h33v25" fill="none" strokeWidth="5" /><circle cx="17" cy="22" r="17" fill={fill} /><circle cx="83" cy="76" r="17" fill={fill} /><circle cx="17" cy="22" r="12" fill={bulb} opacity={item.lightPower / 180} /><circle cx="83" cy="76" r="12" fill={bulb} opacity={item.lightPower / 180} /></>;
      break;
    case 'desklamp':
      artwork = <><ellipse cx="42" cy="94" rx="31" ry="5" fill={fill} /><path d="M42 91 19 54l35-33" fill="none" strokeWidth="5" /><circle cx="19" cy="54" r="5" fill={accent} /><path d="M48 20q10-18 25-6l20 19-28 20z" fill={fill} /><path d="m65 53 28-20" stroke={bulb} strokeWidth="5" /></>;
      break;
    case 'cactus':
      artwork = <><path d="M44 76V14q0-12 12 0v62M44 48H23V28q0-11 10 0v11h11m12 18h19V34q0-12-10 0v13h-9" fill={color} stroke={color} strokeWidth="6" /><path d="M30 74h42l-7 23H37z" fill={accentFill} /><path d="M49 15v55" stroke="#d6e0b0" strokeWidth="2" /></>;
      break;
    case 'fern':
      artwork = <><path d="M30 72h40l-7 25H37z" fill={accentFill} />{[-40, -20, 0, 20, 40].map((angle) => <g key={angle} transform={`rotate(${angle} 50 70)`}><path d="M50 71V10" stroke={color} strokeWidth="2" />{[23, 36, 49, 62].map((y) => <path key={y} d={`M50 ${y}q-25-18-18-23 13 0 18 23 5-23 18-23 7 5-18 23`} fill={color} stroke="none" />)}</g>)}</>;
      break;
    case 'wallplates':
      artwork = <>{[[22, 32, 20], [73, 28, 22], [51, 74, 22]].map(([x, y, r]) => <g key={x}><circle cx={x} cy={y} r={r} fill={fill} /><circle cx={x} cy={y} r={r - 5} fill="none" /><path d={`M${x - 10} ${y}q10-15 20 0-10 15-20 0`} fill={accent} /></g>)}</>;
      break;
    case 'roundmirror':
      artwork = <><circle cx="50" cy="50" r="47" fill={accentFill} /><circle cx="50" cy="50" r="40" fill={fill} /><path d="m26 63 36-36m-21 49 34-34" stroke="#fff" strokeWidth="5" strokeOpacity=".6" /></>;
      break;
    case 'gallery': case 'art':
      artwork = <>{framePanels(item.kind).map((panel, i) => {
        const { x, y, width, height, inset } = panel;
        const image = item.images?.[i];
        const w = width - inset * 2, h = height - inset * 2;
        return <g key={i}>
          <rect x={x} y={y} width={width} height={height} rx={kind === 'art' ? radius : 0} fill={accentFill} />
          <rect x={x + inset} y={y + inset} width={w} height={h} fill="#f5e5c4" />
          {image ? <svg x={x + inset} y={y + inset} width={w} height={h} viewBox={`0 0 ${w * aspect} ${h}`} preserveAspectRatio="none" overflow="hidden">
            <image href={image.src} width={w * aspect} height={h} preserveAspectRatio={image.fit === 'Contain' ? 'xMidYMid meet' : 'xMidYMid slice'} />
          </svg> : <svg x={x + inset} y={y + inset} width={w} height={h} viewBox="0 0 100 100" preserveAspectRatio="none" overflow="hidden">
            <circle cx="65" cy="30" r="20" fill={color} /><path d="M5 95q20-65 50-30l40 30" fill={color} />
          </svg>}
        </g>;
      })}</>;
      break;
    case 'vasepair':
      artwork = <><path d="M13 14h22v24q20 25 10 55H4q-9-30 9-55z" fill={fill} /><path d="M64 40h20v12q17 11 11 41H54q-6-30 10-41z" fill={accentFill} /><path d="M19 48v33m51-23v24" stroke="#fff4dd" strokeOpacity=".5" strokeWidth="3" /></>;
      break;
    case 'menustand': case 'chalkboard':
      artwork = <><path d="M8 98 21 3h58l13 95M15 76h70" fill="none" strokeWidth="4" /><path d="M20 9h60v73H20z" fill={accentFill} /><g transform="translate(15 8) scale(.7)">{lettering}</g></>;
      break;
    case 'gardenbench':
      artwork = <>{legs}{[10, 25, 40, 65, 78].map((y) => <rect key={y} x="4" y={y} width="92" height="9" rx="2" fill={fill} />)}<path d="M15 11v72m70-72v72" strokeWidth="3" /></>;
      break;
    case 'picnictable':
      artwork = <><path d="m25 28-16 69m66-69 16 69M22 56h56" stroke={legFill} strokeWidth="5" fill="none" /><path d="M4 14h92v14H4zm-3 48h30v10H1zm68 0h30v10H69z" fill={fill} /><path d="M13 18h74" opacity=".5" /></>;
      break;
    case 'patioheater':
      artwork = <><path d="M44 27h12v55H44z" fill={fill} /><path d="M32 79h36l7 18H25z" fill={fill} /><path d="M6 12 50 3l44 9v8H6z" fill={fill} /><rect x="31" y="22" width="38" height="16" fill="#d6af6b" /><path d="M37 23v14m9-14v14m9-14v14m9-14v14" /></>;
      break;
    case 'fence':
      artwork = <><path d="M0 39h100v8H0zm0 35h100v8H0z" fill={accentFill} />{[6, 26, 46, 66, 86].map((x) => <path key={x} d={`m${x} 98V16l6-12 6 12v82z`} fill={fill} />)}</>;
      break;
    case 'olivetree':
      artwork = <><path d="M45 79V26m5 28L27 29m23 17 20-21" fill="none" stroke="#927252" strokeWidth="5" />{[[25, 25], [48, 14], [72, 26], [22, 45], [72, 44]].map(([x, y]) => <g key={`${x}-${y}`}><ellipse cx={x} cy={y} rx="20" ry="16" fill={color} stroke="#6b805c" /><path d={`m${x - 8} ${y + 3} 14-9`} stroke="#b5c29d" /></g>)}<path d="M28 76h44l-9 22H37z" fill={accentFill} /></>;
      break;
    case 'outdoorlantern':
      artwork = <><path d="M35 14q0-25 30 0" fill="none" strokeWidth="4" /><path d="M15 27 50 10l35 17v67H15z" fill={fill} /><path d="M15 30h70m-70 60h70M28 31v58m44-58v58" strokeWidth="3" /><rect x="38" y="57" width="24" height="29" fill={accentFill} /><path d="M50 38q-13 16 0 19 13-7 0-19" fill={bulb} /></>;
      break;
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
      artwork = <>{legs}<path d="M3 19 85 9l13 22-83 12z" fill={fill} /><path d="M15 43v8l83-12v-8M3 19v8l12 24" fill={accent} /><path d="M19 48v36m65-44v44" stroke={legFill} strokeWidth="5" /></>;
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
      artwork = <>{kind === 'dining' ? legs : <><path d="M47 24h7v61l22 10H25l22-10z" fill={legFill} /><ellipse cx="50" cy="94" rx="28" ry="3" fill={legFill} /></>}
        {shape === 'Round' ? <><ellipse cx="50" cy="26" rx="48" ry="18" fill={accent} /><ellipse cx="50" cy="20" rx="48" ry="18" fill={fill} /></> : <><path d="m3 8 82-6 13 25-83 8z" fill={fill} /><path d="m15 35 83-8v7L15 42 3 16V8z" fill={accent} /><path d="m3 8 12 27 83-8" fill="none" /></>}
        {detail > 40 && <path d="M23 18q24-9 49 0" fill="none" stroke="#fff9e6" strokeOpacity=".65" />}</>;
      break;
    case 'stool':
      artwork = <><path d="m25 20-10 76m60-76 10 76M19 70h62" fill="none" stroke={legFill} strokeWidth="5" /><ellipse cx="50" cy="20" rx="43" ry="15" fill={accent} /><ellipse cx="50" cy="15" rx="43" ry="14" fill={fill} /></>;
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
    case 'snakeplant': case 'bamboo':
      artwork = <>{[25, 38, 50, 62, 75].map((x, i) => <g key={x}><path d={`M${x} 77Q${x - 6} 35 ${x + (i % 2 ? 5 : -5)} ${8 + i % 3 * 8}Q${x + 9} 40 ${x + 4} 77Z`} fill={color} stroke={color} />{kind === 'bamboo' && <path d={`M${x} 30l-14-9m16 28 14-10`} stroke={color} strokeWidth="3" />}</g>)}<path d="M27 74h46l-7 23H34z" fill={accentFill} /></>;
      break;
    case 'succulent':
      artwork = <>{Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx="50" cy="38" rx="10" ry="30" transform={`rotate(${i * 36} 50 57)`} fill={color} stroke="#486545" />)}<path d="M24 65h52l-8 32H32z" fill={accentFill} /></>;
      break;
    case 'fanpalm': case 'datepalm':
      artwork = <><path d="M47 77 51 24h5l-3 53z" fill={PLANT_POT_COLOR} />{[-70, -35, 0, 35, 70].map((angle) => <g key={angle} transform={`rotate(${angle} 53 28)`}>
        {kind === 'fanpalm' ? <path d="M53 29 31 8q22-16 44 0z" fill={color} stroke={color} /> : <><path d="M53 29Q27-5 53 4Q79-5 53 29" fill={color} stroke={color} />{[8, 15, 22].map((y) => <path key={y} d={`M53 ${y}l-20 8m20-8 20 8`} stroke={color} strokeWidth="2" />)}</>}
      </g>)}<path d="M28 73h44l-7 24H35z" fill={accentFill} /></>;
      break;
    case 'palm':
      artwork = <><path d="M50 77V25" stroke={color} strokeWidth="5" />{[-60, -30, 0, 30, 60].map((angle) => <g key={angle} transform={`rotate(${angle} 50 30)`}><path d="M50 30Q30-8 50 3Q70-8 50 30" fill={color} stroke={color} />{[10, 17, 24].map((y) => <path key={y} d={`M50 ${y}l-18 9m18-9 18 9`} stroke={color} strokeWidth="3" />)}</g>)}<path d="M28 73h44l-7 24H35z" fill={accentFill} /></>;
      break;
    case 'rubbertree':
      artwork = <><path d="M50 77V8" stroke={color} strokeWidth="3" />{[20, 36, 52, 65].map((y, i) => <ellipse key={y} cx={i % 2 ? 64 : 36} cy={y} rx="20" ry="9" transform={`rotate(${i % 2 ? -30 : 30} ${i % 2 ? 64 : 36} ${y})`} fill={color} stroke="#365d3c" />)}<path d="M28 73h44l-7 24H35z" fill={accentFill} /></>;
      break;
    case 'monstera':
    case 'plant': case 'planter':
      artwork = <><path d="M50 75V20M48 53 24 30m28 26 25-29M50 62 17 49" stroke={color} strokeWidth="2" fill="none" />
        {[[25, 29, -45], [50, 20, 0], [75, 29, 45], [20, 50, -65], [77, 50, 65]].slice(0, detail < 25 ? 3 : 5).map(([x, y, angle]) => <ellipse key={x} cx={x} cy={y} rx="10" ry="23" transform={`rotate(${angle} ${x} ${y})`} fill={color} stroke="#657955" />)}
        <path d={kind === 'planter' ? 'M2 67h96l-5 29H7z' : 'M28 66h44l-7 31H35z'} fill={accentFill} /><path d={kind === 'planter' ? 'M0 66h100v7H0z' : 'M25 65h50v8H25z'} fill={accentFill} /><path d="M35 78h29" stroke="#fff2d6" strokeOpacity=".4" /></>;
      break;
    case 'rug':
      artwork = <>{shape === 'Round' ? <><ellipse cx="50" cy="50" rx="48" ry="42" fill={fill} /><ellipse cx="50" cy="50" rx="40" ry="34" fill="none" strokeWidth="3" /></> : <><rect x="2" y="8" width="96" height="84" rx={radius} fill={fill} /><rect x="10" y="16" width="80" height="68" rx={radius / 2} fill="none" strokeWidth="3" /></>}
        {detail > 30 && <><path d="m50 22 25 28-25 28-25-28z" fill={accent} fillOpacity=".45" />{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${6 + i * 8} 2v7m0 82v7`} />)}</>}</>;
      break;
    case 'vase':
      artwork = <><path d="M50 63 26 17m25 47 5-56m-4 55 28-37" fill="none" stroke="#829469" strokeWidth="3" />
        {[[26, 17], [56, 10], [80, 27]].map(([x, y]) => <g key={x}><path d={`M${x} ${y - 9}q15-9 11 5 13 10-3 13-8 12-15-2-14-6-3-15z`} fill={color} /><circle cx={x} cy={y} r="4" fill="#e1be73" /></g>)}
        <path d="M34 59h32l7 27q1 12-23 12T27 86z" fill={accentFill} /><path d="M37 67v19" stroke="#fff6df" strokeOpacity=".45" strokeWidth="3" /></>;
      break;
    case 'mirror':
      artwork = <><rect x="4" y="3" width="92" height="94" rx={radius} fill={accentFill} /><rect x="11" y="10" width="78" height="80" rx={radius / 2} fill={fill} />
        <path d="m25 68 43-43M40 77l33-32" stroke="#fff" strokeOpacity=".6" strokeWidth="5" /></>;
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
    case 'cantileverumbrella':
      artwork = <><path d="M11 96h30M22 96V15h44" fill="none" stroke={accentFill} strokeWidth="5" /><path d="M29 30Q64-3 99 30l-7 7-14-4-14 5-15-5-14 4z" fill={fill} /><path d="M64 6v26m0-26L45 31m19-25 19 25" stroke={accent} fill="none" /></>;
      break;
    case 'squareumbrella':
      artwork = <><path d="M50 20v77m-23 0h46" stroke={accentFill} strokeWidth="4" /><path d="M4 20 50 3l46 17v15H4z" fill={fill} /><path d="M50 3v32M4 20h92" fill="none" stroke={accent} /></>;
      break;
    case 'pergola':
      artwork = <><path d="M9 96V24m82 72V24M27 81V8m46 73V8" stroke={accentFill} strokeWidth="7" />{[0, 18, 36, 54, 72, 90].map((x) => <path key={x} d={`M${x} 29 ${x + 9} 4h7l-9 25z`} fill={fill} />)}<path d="M3 25h94M19 7h62" stroke={accentFill} strokeWidth="5" /></>;
      break;
    case 'chaise':
      artwork = <><path d="M18 72v23m63-26v26" stroke={legFill} strokeWidth="5" /><path d="m6 22 17-9 29 45 45 9-5 12-51-7z" fill={fill} /><path d="M18 63 87 76" stroke={accentFill} strokeWidth="4" /></>;
      break;
    case 'firepit':
      artwork = <><path d="M5 53h90q-3 43-45 43T5 53z" fill={fill} /><ellipse cx="50" cy="53" rx="45" ry="17" fill="#354037" stroke={accentFill} strokeWidth="4" />{[32, 50, 68].map((x) => <path key={x} d={`M${x} 57q-15-16 0-44 17 26 0 44`} fill="#efb95f" stroke="#cf9951" />)}</>;
      break;
    case 'waterfeature':
      artwork = <><path d="M45 15h10v70H45z" fill={accentFill} />{[[50, 87, 47], [50, 54, 33], [50, 19, 20]].map(([x, y, r]) => <g key={y}><path d={`M${x-r} ${y}q0 17 ${r} 17t${r}-17z`} fill={fill} /><ellipse cx={x} cy={y} rx={r} ry="6" fill="#a9d2d3" /></g>)}<path d="M24 55v24m52-24v24M36 21v26m28-26v26" stroke="#a9d2d3" strokeWidth="3" /></>;
      break;
    case 'cattree': case 'scratchpost':
      artwork = <><path d="M8 90h84v8H8z" fill={accentFill} /><path d="M44 12h12v78H44z" fill={fill} /><ellipse cx="50" cy="12" rx="35" ry="9" fill={accentFill} />{kind === 'cattree' && <><path d="M4 56h65v7H4z" fill={accentFill} /><rect x="54" y="27" width="40" height="31" rx="5" fill={fill} /><circle cx="74" cy="44" r="10" fill="#354037" /><path d="M21 18v17" /><circle cx="21" cy="39" r="6" fill={fill} /></>}{[24, 34, 44, 54, 64, 74].map((y) => <path key={y} d={`M45 ${y}h10`} opacity=".5" />)}</>;
      break;
    case 'catbed':
      artwork = <><ellipse cx="50" cy="65" rx="47" ry="29" fill={accentFill} /><ellipse cx="50" cy="57" rx="45" ry="25" fill={fill} /><ellipse cx="50" cy="58" rx="29" ry="15" fill={accentFill} /></>;
      break;
    case 'catcave': case 'litterbox':
      artwork = <><path d={kind === 'catcave' ? 'M5 90V52Q5 3 50 3t45 49v38z' : 'M5 90V23Q5 5 23 5h54q18 0 18 18v67z'} fill={fill} /><path d="M30 90V55q0-24 20-24t20 24v35z" fill="#354037" /><path d="M8 91h84" stroke={accentFill} strokeWidth="8" /></>;
      break;
    case 'catbowls':
      artwork = <><path d="M2 62h96v19H2z" fill={accentFill} />{[26, 74].map((x) => <g key={x}><path d={`M${x - 21} 41h42l-5 25h-32z`} fill={fill} /><ellipse cx={x} cy="41" rx="21" ry="8" fill={x === 26 ? '#a7794b' : '#a9d2d3'} /></g>)}</>;
      break;
    case 'catfountain':
      artwork = <><ellipse cx="50" cy="77" rx="44" ry="18" fill={fill} /><ellipse cx="50" cy="69" rx="39" ry="14" fill="#a9d2d3" /><path d="M45 31h10v39H45z" fill={accentFill} /><ellipse cx="50" cy="31" rx="25" ry="9" fill={fill} /><path d="M27 33v24m46-24v24" stroke="#a9d2d3" strokeWidth="3" /></>;
      break;
    case 'cattunnel':
      artwork = <><path d="M18 22h63q17 0 17 28T81 78H18z" fill={fill} />{[37, 57, 77].map((x) => <path key={x} d={`M${x} 23q18 27 0 54`} fill="none" stroke={accentFill} strokeWidth="3" />)}<ellipse cx="18" cy="50" rx="16" ry="28" fill="#354037" stroke={accentFill} strokeWidth="5" /></>;
      break;
    default: artwork = <rect x="5" y="5" width="90" height="90" rx={radius} fill={fill} />;
  }
  return <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" overflow="visible" aria-hidden="true">
    <MaterialDefs id={id} material={item.material} color={color} accent={accent} pattern={item.pattern} />
    {(item.legColor !== undefined || item.legMaterial !== undefined) && <MaterialDefs id={`legs-${id}`} material={item.legMaterial ?? item.material} color={item.legColor ?? accent} accent={item.legColor ?? accent} />}
    <g stroke={accent} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" data-material={item.material} data-role={furnishingRole(item.kind)} data-style={kind}>{artwork}</g>
  </svg>;
}

export function RoomArtwork({ design, grid, outdoor = false }: { design: Design; grid: boolean; outdoor?: boolean }) {
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
        {isOutdoorFloorStyle(r.floorStyle) && <g transform={`scale(${size / 80})`}><OutdoorFloorTile style={r.floorStyle} color={r.floor} accent={r.floorAccent} /></g>}
      </pattern>
      <pattern id={`wall-${id}`} width="60" height="80" patternUnits="userSpaceOnUse">
        <rect width="60" height="80" fill={r.wall} />
        {r.wallStyle === 'Brick' && <path d="M0 0h60v40H0zm30 0v20M0 20h60M10 20v20M0 40h60v40H0zm30 0v20M0 60h60M10 60v20" fill="none" stroke={r.trim} strokeOpacity=".4" strokeWidth="2" />}
        {r.wallStyle === 'Stripes' && <rect width="15" height="80" fill={r.trim} opacity=".18" />}
        {r.wallStyle === 'Paneling' && <rect x="5" y="8" width="50" height="64" rx="2" fill="none" stroke={r.trim} strokeOpacity=".45" />}
      </pattern>
      <linearGradient id={`daylight-${id}`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#fff8d9" stopOpacity=".4" /><stop offset="1" stopColor="#fff8d9" stopOpacity="0" /></linearGradient>
    </defs>
    <rect width={SCENE_WIDTH} height={SCENE_HEIGHT} fill={outdoor ? '#dce9e5' : r.wall} />
    {!outdoor && <>
    <rect x="180" width="840" height="398" fill={`url(#wall-${id})`} />
    <path d="M0 0h180v390L0 690zm1020 0h180v690l-180-300z" fill={`url(#wall-${id})`} />
    <path d="M0 0h180v390L0 690z" fill="#fff8db" opacity=".18" /><path d="M1020 0h180v690l-180-300z" fill={r.trim} opacity=".12" />
    <polygon points={floor} fill={`url(#floor-${id})`} />
    <path d="M0 690 180 390h840l180 300M180 0v390m840-390v390" fill="none" stroke={r.trim} strokeWidth="3" />
    <path d="M0 672 180 376h840l180 296" fill="none" stroke={r.trim} strokeWidth="10" />
    <path d="M0 663 180 369h840l180 294" fill="none" stroke="#fff6df" strokeOpacity=".6" strokeWidth="3" />
    </>}
    {outdoor && <>
      <polygon points={floor} fill={`url(#floor-${id})`} />
      <path d="M180 390h840" stroke={r.trim} strokeWidth="45" />
      {Array.from({ length: 19 }, (_, i) => <path key={i} d={`M${180 + i * 46.6} 325v85`} stroke={r.trim} strokeWidth="8" />)}
    </>}
    <rect width="1200" height="12" fill={r.trim} /><path d="M0 18h1200" stroke={r.trim} strokeWidth="2" />
    <rect x="185" y="24" width="830" height={28 + r.wallHeight / 5} rx="4" fill={r.facade} />
    {r.awningStyle !== 'None' && <g>
      <rect x="190" y="28" width="820" height="23" fill={r.awning} />
      {r.awningStyle === 'Striped' && Array.from({ length: 28 }, (_, i) => <path key={i} d={`M${190 + i * 29.3} 28h14.65v23q-7 8-14.65 0z`} fill={r.facade} />)}
    </g>}
    <rect x="430" y="72" width="340" height="56" rx="9" fill={r.wall} stroke={r.trim} strokeWidth="3" />
    <rect x="437" y="79" width="326" height="42" rx="5" fill="none" stroke={r.trim} strokeOpacity=".4" />
    <text x="600" y="107" textAnchor="middle" fontFamily={r.font} fontSize={Math.min(24, 450 / Math.max(12, r.name.length))} fill={r.nameColor ?? r.trim}>{r.name}</text>
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
  if (furnishingRole(item.kind) === 'rug') {
    const floor = projectFloor(item.x, item.y, design.room);
    return <g transform={`translate(${floor.x} ${floor.y}) scale(1 .36) rotate(${item.rotation})`} opacity={item.opacity / 100}>
      <svg x={-p.width / 2} y={-item.depth * p.scale / 2} width={p.width} height={item.depth * p.scale} overflow="visible"><FurnishingArt item={item} /></svg>
    </g>;
  }
  return <g transform={`translate(${p.x} ${p.y})`} opacity={item.opacity / 100} data-kind={item.kind}>
    {!['window', 'art', 'mirror', 'menu', 'sign', 'clock', 'sconce', 'shelf', 'pendant'].includes(furnishingRole(item.kind)) && <ellipse cy="1" rx={p.width * .48} ry={Math.min(12, item.depth * p.scale * .12)} fill="#725741" opacity=".12" stroke="none" />}
    <g transform={`scale(${p.mirror} 1)`}>
      <svg x={-p.width / 2} y={-p.height} width={p.width} height={p.height} overflow="visible"><FurnishingArt item={item} aspect={p.width / p.height} /></svg>
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
  if (design.areas?.length) {
    const areas = designAreas(design);
    return <svg className={className} viewBox={`0 0 ${SCENE_WIDTH * areas.length} ${SCENE_HEIGHT}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {areas.map((area, i) => <svg key={area.id} x={i * SCENE_WIDTH} width={SCENE_WIDTH} height={SCENE_HEIGHT} viewBox={SCENE_VIEWBOX}>
        <RoomArtwork design={area} grid={false} outdoor={area.outdoor} />
        {area.items.filter((item) => !item.hidden).map((item) => <PlacedFurnishing key={item.id} item={item} design={area} />)}
        <RoomAtmosphere room={area.room} />
      </svg>)}
    </svg>;
  }
  return <svg className={className} viewBox={SCENE_VIEWBOX} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <RoomArtwork design={design} grid={false} />
    {design.items.filter((item) => !item.hidden).map((item) => <PlacedFurnishing key={item.id} item={item} design={design} />)}
    <RoomAtmosphere room={design.room} />
  </svg>;
}
