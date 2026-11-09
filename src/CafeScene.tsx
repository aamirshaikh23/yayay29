export default function CafeScene() {
  return (
    <svg className="cafe-room-art" viewBox="0 0 1200 660" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="wallpaper" width="32" height="42" patternUnits="userSpaceOnUse">
          <path d="M0 0h32v42H0z" fill="#f3e5c7" /><path d="M5 0v42m22-42v42" stroke="#dfc7a2" strokeWidth="1" />
          <path d="M16 9q-10 9 0 16 10-7 0-16zm0 22v6" fill="none" stroke="#d7bb93" strokeWidth="1.5" />
        </pattern>
        <pattern id="wallTiles" width="44" height="22" patternUnits="userSpaceOnUse">
          <path d="M0 0h44v22H0z" fill="#e0c3b4" stroke="#f8ead8" strokeWidth="3" /><path d="M22 0v22" stroke="#f8ead8" strokeWidth="3" />
        </pattern>
        <pattern id="floorBoards" width="110" height="64" patternUnits="userSpaceOnUse" patternTransform="skewX(-35)">
          <path d="M0 0h110v64H0z" fill="#e8d0b1" stroke="#cda581" strokeWidth="2" /><path d="M17 16h54m-23 32h45" stroke="#d8b792" strokeWidth="1.5" />
        </pattern>
        <pattern id="awning" width="34" height="25" patternUnits="userSpaceOnUse">
          <path d="M0 0h34v15q-8 12-17 0Q8 27 0 15z" fill="#fff3d8" stroke="#bb8561" strokeWidth="1.5" />
          <path d="M8 5q9 7 18 0" fill="none" stroke="#d9a36c" strokeWidth="1.3" />
        </pattern>
        <g id="cafePlant" stroke="#798465" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M0 0q-20-62-45-72 0 37 40 59Q-4-89 16-96q19 41-14 91Q16-63 49-64q-4 40-44 56" fill="#a5b88b" />
          <path d="M0-5q-11-40-26-52M0-7q13-42 17-64M0-7q16-28 33-41" fill="none" />
          <path d="M-25 0h50L19 49h-37z" fill="#c69a73" stroke="#936a4e" /><path d="M-20 8h40" stroke="#e8c69b" strokeWidth="4" />
        </g>
        <g id="cafeChair" stroke="#9c6c4d" strokeWidth="2.7" strokeLinejoin="round">
          <path d="m-43 21-7 66m88-67 9 63" fill="none" strokeWidth="5" />
          <path d="M-50-39q0-26 24-26h53q23 0 23 26v43l-18 25h-65l-17-25z" fill="#d9b794" />
          <path d="M-42-38q0-18 18-18h46q19 0 19 18v41h-83z" fill="#fff0d6" />
          <path d="M-17-55v53m30-53v53" stroke="#e5cbaa" strokeWidth="2" />
          <path d="M-42 3q42-13 83 0v26h-83z" fill="#f3dfbf" /><path d="M-42 9q42-13 83 0" fill="none" />
          <path d="M-53-16q-16-12-19 2l8 40 25 8m93-50q16-12 19 2l-8 40-25 8" fill="#c4936d" />
          <path d="M-61 7 49 37m-8 0-79 7" fill="none" stroke="#b5835f" />
          <path d="M24-27q-3-15 12-18 17 2 17 20-8 22-25 22z" fill="#b87b4d" stroke="#9e6843" />
          <path d="M35-39q11 6 9 19" fill="none" stroke="#d7a16b" />
        </g>
        <g id="cafeTable" stroke="#936449" strokeWidth="2.7" strokeLinejoin="round">
          <path d="M-44 5h88v48q-42 22-88 0z" fill="#bd9266" />
          {[-35, -25, -15, -5, 5, 15, 25, 35].map((x) => <path key={x} d={`M${x} 12v43`} stroke="#a57b55" strokeWidth="1.4" />)}
          <ellipse cy="3" rx="49" ry="19" fill="#ecd0a0" /><ellipse cy="-1" rx="46" ry="17" fill="#f4dcaf" />
          <path d="M-21-2q10-15 21-1 12-14 22 0-20 19-43 1z" fill="#fff8e4" stroke="none" />
        </g>
        <g id="shelfCup" stroke="#9d7050" strokeWidth="1.8">
          <path d="M0 0h24l-3 21H3z" fill="#fff1d7" /><path d="M24 3q13 0 7 12h-9" fill="none" /><path d="M3 25h22" />
        </g>
      </defs>
      <path d="M0 0h1200v660H0z" fill="#f6e8cd" />
      <path d="M0 0h850v345H0z" fill="#f2e3c2" />
      <path d="M0 345h1200v315H0z" fill="url(#floorBoards)" />
      <path d="M0 0h422v345L0 500z" fill="#fff2d6" stroke="#a87955" strokeWidth="3" />
      <path d="M0 0h422v228L0 377z" fill="#cddfd2" />
      <path d="m0 279 422-104M0 360l422-146" stroke="#fff6e3" strokeWidth="8" />
      {[30, 128, 222, 308, 380].map((x, i) => <g key={x}><path d={`M${x} 0v${360 - i * 32}`} stroke="#956948" strokeWidth="13" /><path d={`M${x + 2} 0v${360 - i * 32}`} stroke="#f2dcb7" strokeWidth="6" /></g>)}
      <path d="M0 317q38-167 78-106 49-111 87-51 49-111 80-42 26-86 63-28 30-73 63-28 25-63 51-32v160L0 390z" fill="#a6ba8b" opacity=".8" />
      <g fill="#e9b18f" stroke="#be8e65" strokeWidth="1.3">{[[25, 228], [84, 193], [142, 194], [185, 154], [256, 124], [327, 91]].map(([x, y]) => <path key={x} d={`M${x} ${y}q-11-17-18-3-11 7 0 13 3 14 14 3 15 1 4-13z`} />)}</g>
      <path d="m0 372 423-151v29L0 407z" fill="#ead2aa" stroke="#a87955" strokeWidth="3" />
      <path d="m0 365 423-151v14L0 385z" fill="#fff5df" stroke="#a87955" strokeWidth="2" />
      <path d="M430 80h422v219H430z" fill="url(#wallTiles)" />
      <path d="M423 5h430v64H423z" fill="#b89160" stroke="#926b47" strokeWidth="3" />
      <path d="M430 12h415v40H430z" fill="#e7c68c" /><path d="M430 46h415v31H430z" fill="url(#awning)" />
      <path d="M449 99h129v116H449z" fill="#f1dfbf" stroke="#a77c59" strokeWidth="4" /><path d="M456 107h115v99H456z" fill="#cad6c9" />
      <path d="M463 112h102v85H463z" fill="#e3e5d6" /><path d="M456 152h115m-59-45v99" stroke="#faf0db" strokeWidth="4" />
      <path d="M613 330V127q0-82 72-82t72 82v203z" fill="#c1b481" stroke="#966b48" strokeWidth="5" />
      <path d="M623 318V128q0-70 62-70t62 70v190z" fill="#e7d4a3" stroke="#a88152" strokeWidth="3" />
      <path d="M632 174v-46q0-58 53-58t53 58v46z" fill="#d5ddc8" stroke="#a88152" strokeWidth="3" />
      <path d="M685 70v248m-53-144h106m-103-56 100 2m-87-33 38 32 37-31" fill="none" stroke="#a88152" strokeWidth="3" />
      <path d="M632 190h44v105h-44zm62 0h44v105h-44z" fill="#e8dfbc" stroke="#a88152" strokeWidth="2" />
      <path d="M673 227v17m24-17v17" stroke="#b7944b" strokeWidth="5" />
      <path d="M849 0h351v426L849 345z" fill="url(#wallpaper)" stroke="#a77a54" strokeWidth="3" />
      <path d="M849 340 1200 423v22l-351-80z" fill="#d3ac7f" stroke="#a77a54" strokeWidth="2" />
      <path d="M875 66 955 81v122l-80-16z" fill="#9c6a49" stroke="#855e43" strokeWidth="4" /><path d="m884 78 62 12v100l-62-12z" fill="#f2d7a8" />
      <path d="M902 122h27l-2 29h-22z" fill="#c39864" stroke="#996d48" strokeWidth="2" /><path d="M929 127q16 0 7 13h-8" fill="none" stroke="#996d48" strokeWidth="2" />
      <path d="m898 160 36 7" stroke="#b68e59" strokeWidth="2" />
      <path d="M1006 74q0-33 79-19t79 57v224l-158-37z" fill="#b68656" stroke="#926647" strokeWidth="3" />
      <path d="M1014 91q5-35 71-22t71 49v24l-142-30z" fill="url(#awning)" stroke="#926647" strokeWidth="2" />
      <path d="m1010 170 150 34m-150 43 150 35" stroke="#8f6345" strokeWidth="7" />
      <use href="#shelfCup" x="1023" y="126" /><use href="#shelfCup" x="1067" y="137" /><use href="#shelfCup" x="1111" y="147" />
      <use href="#shelfCup" x="1022" y="198" /><use href="#shelfCup" x="1067" y="210" /><use href="#shelfCup" x="1111" y="220" />
      <path d="M763 245q35-25 66 0v65h-66z" fill="#7c5141" stroke="#634637" strokeWidth="3" /><path d="M753 254h80v14h-80z" fill="#8f6450" />
      <path d="M764 269h58v12h-58z" fill="#f7e8ce" /><path d="M770 268v12m8-12v12m8-12v12m8-12v12m8-12v12m8-12v12" stroke="#704e3b" strokeWidth="2" />
      <path d="M767 311v27m52-27v27" stroke="#704e3b" strokeWidth="5" />
      <use href="#cafePlant" transform="translate(53 427) scale(1.05)" /><use href="#cafePlant" transform="translate(382 275) scale(.5)" /><use href="#cafePlant" transform="translate(844 299) scale(.6)" />
      <g stroke="#946c4b" strokeWidth="2.5" fill="#fff5df">
        {[[72, 81, 1], [190, 65, .85], [292, 49, .72], [377, 32, .6]].map(([x, y, s]) => <g key={x} transform={`translate(${x} ${y}) scale(${s})`}><path d="M0-100V0" fill="none" /><path d="M-23 3q0-15 23-15T23 3l7 16h-60z" /><path d="M-26 22h52" stroke="#e2bb72" strokeWidth="3" /></g>)}
      </g>
      <g transform="translate(305 336) scale(.65)"><use href="#cafeChair" transform="translate(-60 -50)" /><use href="#cafeTable" transform="translate(10 5)" /><use href="#cafeChair" transform="translate(85 -15) scale(-1 1)" /></g>
      <g transform="translate(478 362) scale(.8)"><use href="#cafeChair" transform="translate(-63 -33)" /><use href="#cafeTable" transform="translate(4 24)" /><use href="#cafeChair" transform="translate(93 8) scale(-1 1)" /></g>
      <g transform="translate(274 450)"><use href="#cafeChair" transform="translate(-80 -30)" /><use href="#cafeTable" transform="translate(10 44)" /><use href="#cafeChair" transform="translate(113 18) scale(-1 1)" /></g>
      <g transform="translate(742 405) scale(.85)"><use href="#cafeChair" transform="translate(-75 -27)" /><use href="#cafeTable" transform="translate(9 26)" /><use href="#cafeChair" transform="translate(98 8) scale(-1 1)" /></g>
      <g transform="translate(979 453)"><use href="#cafeChair" transform="translate(-72 -23)" /><use href="#cafeTable" transform="translate(9 31)" /><use href="#cafeChair" transform="translate(99 13) scale(-1 1)" /></g>
      <path d="M0 570h1200v90H0z" fill="#c5936c" stroke="#946b4d" strokeWidth="3" /><path d="M0 558h1200v19H0z" fill="#f7ead0" stroke="#946b4d" strokeWidth="3" />
      {Array.from({ length: 60 }, (_, i) => <path key={i} d={`M${i * 21} 580v80`} stroke="#a97a53" strokeWidth="2" />)}
    </svg>
  );
}
