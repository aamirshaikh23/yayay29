import { useId } from 'react';
import { ingredients } from './memoryOrders';
import type { IngredientId } from './memoryOrders';

export function IngredientArt({ id }: { id: IngredientId }) {
  const color = ingredients.find((ingredient) => ingredient.id === id)!.color;
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <g stroke="#78563f" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        {id === 'espresso' ? <>
          <path d="M15 20h50v44H15z" fill="#a3b4a1" /><path d="M12 17h56v10H12z" fill="#e3d4b8" />
          <path d="M24 35h32v8H24z" fill="#5b4a3e" /><path d="M38 43v11" /><path d="M30 52h20v14H30z" fill="#fff3db" />
          <path d="M50 55q11 0 5 8h-5" fill="none" /><path d="M11 68h59" /><circle cx="57" cy="32" r="3" fill="#e2b464" />
        </> : id === 'matcha' ? <>
          <path d="M13 44h54q-3 25-27 25T13 44z" fill="#b9c9a5" />
          <ellipse cx="40" cy="44" rx="27" ry="8" fill="#8fa875" />
          <path d="m33 40 5-24h8l5 24m-15-2 4-20m0 22 2-22m3 22V18" fill="none" stroke="#b48b59" />
          <path d="M36 13h12v7H36z" fill="#d8bd8c" /><path d="M28 71h24" />
          <path d="M21 45q7-4 13-1m13 1h9" fill="none" stroke="#d7e4c4" />
        </> : id === 'tea' ? <>
          <path d="M25 29q-17 6-14 22t27 16q27 0 24-19L52 29z" fill="#a8b99a" />
          <path d="M19 39 5 28l5 23 12 6m37-18q20-8 14 12-1 9-13 7" fill="none" />
          <path d="M25 28h28q1-8-14-8t-14 8z" fill="#eee2c6" /><path d="M39 20v-6" />
          <path d="M30 45q13-19 21 0-11 17-21 0z" fill="#eff0d6" /><path d="M34 51l14-13" />
        </> : id === 'milk' || id === 'oat' ? <>
          <path d="M23 22 31 11h20l8 11v47H23z" fill={color} /><path d="M23 22h36M31 11v11m20-11v11" fill="none" />
          <path d="M23 34h36v22H23z" fill={id === 'oat' ? '#b49a72' : '#9aaf9c'} stroke="none" />
          <text x="41" y="49" fontSize="13" fill="#fff8e9" stroke="none" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">{id === 'oat' ? 'OAT' : 'MILK'}</text>
          <path d="M30 64h21" stroke="#b09a7d" />
        </> : id === 'ice' ? <>
          <path d="M16 33h48l-5 36H21z" fill="#e0e9dc" />
          <path d="m23 24 16-4 5 16-16 4zm23 10 15 4-4 15-15-4zM29 45l16-4 4 16-16 4z" fill={color} />
          <path d="m28 27 5-1m18 13 4 1m-21 8 6-2" stroke="#fff9e9" strokeWidth="3" /><path d="M20 31h40" fill="none" />
        </> : id === 'cocoa' || id === 'cinnamon' ? <>
          <path d="M22 29h36v40H22z" fill={color} /><path d="M20 21h40v10H20z" fill="#e6d9bb" />
          <path d="M27 39h26v20H27z" fill="#f3e7d0" />
          {id === 'cocoa'
            ? <path d="M33 51q1-13 13-9 9 9-7 13m-4-1 10-10" fill="#aa7958" />
            : <><path d="m33 55 12-12m-5 13 11-12" stroke="#a26c48" strokeWidth="4" /><path d="M28 25h1m9 0h1m9 0h1" stroke="#78563f" strokeWidth="3" /></>}
        </> : <>
          <path d="M29 30V19h22v11l9 9v30H20V39z" fill={color} />
          <path d="M27 13h26v8H27z" fill="#d4c6a9" /><path d="M24 43h32v18H24z" fill="#fff0d5" />
          {id === 'honey'
            ? <path d="M40 46q-11 13 0 13 11 0 0-13z" fill="#d99c44" strokeWidth="1.5" />
            : <path d="M32 55q9-17 16-7-8 15-16 7m3-2 10-4" fill="#ebcf96" strokeWidth="1.5" />}
        </>}
      </g>
    </svg>
  );
}

export function DrinkArt({ cup, stirred, serving = false }: { cup: IngredientId[]; stirred: boolean; serving?: boolean }) {
  const clip = useId();
  const hasMilk = cup.includes('milk') || cup.includes('oat');
  const color = cup.includes('cocoa') ? (hasMilk ? '#ac7657' : '#704833')
    : cup.includes('espresso') ? (hasMilk ? '#c29a72' : '#79503b')
      : cup.includes('matcha') ? (hasMilk ? '#b1c297' : '#8fa875')
        : hasMilk ? '#ddd0a6' : '#b5bb87';
  return (
    <svg className={`drink-art${stirred ? ' drink-art--stirred' : ''}${serving ? ' drink-art--served' : ''}`}
      viewBox="0 0 210 210" role="img" aria-label={cup.length ? `Your ${stirred ? 'stirred' : 'unstirred'} drink, ${cup.length} ingredients` : 'An empty cup waiting for your first ingredient'}>
      <defs><clipPath id={clip}><path d="M47 64h113l-10 104q-4 20-47 20-42 0-47-20z" /></clipPath></defs>
      <ellipse cx="103" cy="190" rx="74" ry="12" fill="#a77c53" opacity=".19" />
      <ellipse cx="103" cy="185" rx="78" ry="12" fill="#fff0d4" stroke="#9c7353" strokeWidth="2.5" />
      <path d="M159 82h12q29 0 24 27-4 30-41 27" fill="none" stroke="#805d43" strokeWidth="13" />
      <path d="M159 82h12q29 0 24 27-4 30-41 27" fill="none" stroke="#f8e9cd" strokeWidth="8" />
      <path d="M47 64h113l-10 104q-4 20-47 20-42 0-47-20z" fill="#fff2d6" stroke="#805d43" strokeWidth="3" />
      <g clipPath={`url(#${clip})`}>
        {cup.map((id, index) => (
          <rect className="drink-layer" key={id} x="47" y={167 - (index + 1) * 17} width="113" height="70"
            fill={stirred ? color : ingredients.find((ingredient) => ingredient.id === id)!.color} />
        )).reverse()}
        {cup.includes('ice') && <g fill="#d6ece4" stroke="#a9c8bd" strokeWidth="1.5" opacity=".9"><rect x="68" y="96" width="20" height="18" rx="4" transform="rotate(-15 68 96)" /><rect x="112" y="91" width="20" height="20" rx="4" transform="rotate(12 112 91)" /><rect x="94" y="122" width="20" height="18" rx="4" /></g>}
        {cup.includes('cinnamon') && <g fill="#98623f">{[65, 77, 93, 107, 124, 138].map((x, i) => <circle key={x} cx={x} cy={88 + (i % 3) * 5} r="1.7" />)}</g>}
      </g>
      <ellipse cx="103" cy="64" rx="56" ry="10" fill="#fff5df" stroke="#805d43" strokeWidth="3" />
      {cup.length > 0 && <ellipse cx="103" cy="64" rx="48" ry="6" fill={stirred ? color : ingredients.find((ingredient) => ingredient.id === cup.at(-1))!.color} />}
      <path d="M69 85l7 73" fill="none" stroke="#fffaf0" strokeWidth="5" strokeLinecap="round" opacity=".6" />
      {stirred && <path d="M89 123q14-18 28 0-14 20-28 0z" fill="#fff2d8" opacity=".8" />}
      {cup.length > 0 && !cup.includes('ice') && <g className="cup-steam" fill="none" stroke="#fffaf0" strokeWidth="4" strokeLinecap="round"><path d="M84 42q-10-10 0-22" /><path d="M105 37q-10-10 0-22" /><path d="M125 42q-10-10 0-22" /></g>}
      {stirred && <path className="stir-spoon" d="m130 43 23-28q8-8 10-1t-5 11l-25 22" fill="#e4dcc6" stroke="#805d43" strokeWidth="2" />}
    </svg>
  );
}

export function CafeMark() {
  return <svg viewBox="0 0 40 40" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 15h22l-2 17H10zM29 18q10-1 6 8h-7M10 36h18M14 10q-4-4 0-8m9 8q-4-4 0-8" /><path d="M15 23q5-7 10 0-5 8-10 0z" fill="currentColor" stroke="none" /></g></svg>;
}

export function CakeArt() {
  return <svg viewBox="0 0 160 140" aria-hidden="true"><g stroke="#885d43" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"><ellipse cx="80" cy="125" rx="65" ry="9" fill="#f4e3bf" /><path d="M26 76h108v41q-54 21-108 0z" fill="#e4b49d" /><ellipse cx="80" cy="76" rx="54" ry="16" fill="#fff1d2" /><path d="M26 76v14q7 13 14 0 8-13 14 2 7 11 15-1 10-11 20 3 10 10 17-4 8-10 15 0 7 11 13-3V76" fill="#fff1d2" /><path d="M27 109q53 17 106 0" fill="none" /><path d="M52 68V42m28 23V32m28 36V42" stroke="#b9755c" strokeWidth="6" /><path d="M52 35q-12-10 0-23 12 13 0 23m28-10Q68 15 80 2q12 13 0 23m28 10q-12-10 0-23 12 13 0 23" fill="#e9c779" stroke="#bd9150" /><path d="M48 98h1m17 4h1m22 0h1m19-3h1" stroke="#ba7d63" strokeWidth="4" /></g></svg>;
}
