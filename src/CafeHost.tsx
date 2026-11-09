import type { HostName } from './memoryOrders';

type Mood = 'waiting' | 'happy' | 'oops';

export default function CafeHost({ name, mood = 'waiting' }: { name: HostName; mood?: Mood }) {
  return (
    <div className={`human-customer human-customer--${mood} cafe-host--${name.toLowerCase()}`}>
      {name === 'Olive' ? <Olive mood={mood} /> : <Aamir mood={mood} />}
    </div>
  );
}

function Aamir({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 220 310" role="img" aria-label="Aamir, with a warm dusky-fair complexion and a blue café shirt">
      <g stroke="#704d3b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M61 114V72q-4-30 20-36-5-17 1-27 21 24 48 13 38 3 35 48v44z" fill="#493b34" />
        <path d="M87 142v32l-29 12q-19 8-24 35L22 310h176l-12-89q-5-27-24-35l-29-12v-32z" fill="#7e9daf" />
        <path d="M91 138v39q19 15 38 0v-39" fill="#c99979" />
        <path d="M76 181q34 37 68 0l12 11-5 31h-82l-5-31z" fill="#e9d9ba" />
        <path d="M64 193l8 29-8 88h93l-9-88 8-29" fill="#e9d9ba" />
        <path d="M83 253h54v32H83z" fill="none" /><path d="M87 260h46" stroke="#c3a887" strokeWidth="1.5" />
        <path d="M46 224l-10 67q-2 11 10 14h24q9-2 9-10t-10-10H57l9-59m108-2 10 67q2 11-10 14h-24q-9-2-9-10t10-10h12l-9-59" fill="#c99979" />
        <path d="M46 218l-4 24 23 5 5-27m80 0 5 27 23-5-4-24" fill="#7e9daf" />
        <path d="M58 91q-12-10-15 3t16 19m103-22q12-10 15 3t-16 19" fill="#c99979" />
        <path d="M62 70q0-29 48-29t48 29v39q0 48-48 54-48-6-48-54z" fill="#c99979" />
        <path d="M61 83V67q8-30 28-30 28 11 60-1 16 18 10 48l-8-28q-48 19-78 3z" fill="#493b34" />
        <path d="M80 89q8-5 15-1m30 0q8-4 15 1" fill="none" strokeWidth="2" />
        <g className="customer-eyes" fill="#49352d" stroke="none"><ellipse cx="87" cy="102" rx="3.1" ry="4.3" /><ellipse cx="134" cy="102" rx="3.1" ry="4.3" /></g>
        <path d="M110 101l-3 17q4 4 9 0" fill="none" stroke="#a56d52" strokeWidth="1.8" />
        <ellipse cx="78" cy="119" rx="9" ry="5" fill="#d78c7b" opacity=".35" stroke="none" /><ellipse cx="143" cy="119" rx="9" ry="5" fill="#d78c7b" opacity=".35" stroke="none" />
        {mood === 'oops' ? <path d="M100 136q10-6 21 0" fill="none" />
          : mood === 'happy' ? <path d="M97 130q13 20 27 0z" fill="#fff3db" />
            : <path d="M99 132q12 11 23-1" fill="none" />}
        <path d="M102 274q8-10 16 0-8 11-16 0z" fill="#7e9daf" stroke="none" />
      </g>
    </svg>
  );
}

function Olive({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 220 310" role="img" aria-label="Olive, a smiling white Persian cat with a closely trimmed pale coat, patchy fluffy legs and tail, and a round face">
      <g stroke="#a89783" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M149 264q40 1 36-32-3-16-14-29-8-12 0-19 10-8 17 5 20 35 15 61-6 34-48 34" fill="#f3f0e9" />
        <path d="m170 204-9-5 5-8-3-7 10-3 5-7 6 8 9 2-2 9 6 7-7 5q-11 5-20-1z" fill="#fffdf7" />
        <path d="M81 164q-16 17-19 49-3 23-12 41-13 32 40 34h45q43-4 29-34-12-24-17-50-3-28-19-40z" fill="#e7e2da" />
        <path d="M68 204q4-23 14-26l9 23-9 40-20 8zm69 13q15 9 18 29 5 19-12 25-17-18-6-54z" fill="#d2ccc3" stroke="none" />
        <path d="M76 179q13 4 10 22m-18 9 8 13m61-31-5 22m12 6 5 15" fill="none" stroke="#c4bcb0" strokeWidth="1.3" />
        <path d="M87 201q-6 26-4 51m43-51q6 26 4 51" fill="none" stroke="#c4bcb0" />
        <path d="m66 251 8-9 8 5 9-5 7 10 5 3-4 10q8 17-16 18-28 1-22-15l-6-7zm49 1 8-8 8 3 8-5 8 9 8 5-6 11q8 16-17 16-26-1-21-17l-5-7z" fill="#fffdf7" />
        <path d="M72 272v5m10-6v8m43-8v8m10-7v6" stroke="#d3cabe" strokeWidth="1.5" />
        <path d="M58 103 48 62q-1-13 12-7l29 18m70 29 13-41q2-13-12-7l-30 18" fill="#f5f2eb" />
        <path d="m58 84-2-21 23 17m80 3 5-21-24 18" fill="#d8c3bb" stroke="#bfa99e" strokeWidth="1.5" />
        <path d="M59 96q-13 9-12 25l-8 8 8 7-4 10 10 5q8 28 57 31 49-3 57-31l10-5-4-10 8-7-8-8q1-16-12-25-8-28-51-28T59 96z" fill="#f8f6ef" />
        <path d="M91 72q8-2 12 4l-2 24-10 12-7-8 5-14zm33 3q11 6 16 19l10 13-13 5-14-16-7-18z" fill="#d8d1c5" stroke="none" />
        <path d="M58 113q10-14 25-8l13 16-9 17-26-3zm77-6q15-9 25 7l-2 19-24 5-10-15z" fill="#e3dcd0" stroke="none" />
        <path d="M102 80l-3 16m17-16 5 17m-53 48-8 7m94-8 7 7" fill="none" stroke="#d0c7b9" strokeWidth="1.4" />
        <g className="olive-eyes" fill="#b9b08a" stroke="#746957" strokeWidth="2">
          <ellipse cx="83" cy="120" rx="12" ry={mood === 'happy' ? 6 : 9} /><ellipse cx="137" cy="120" rx="12" ry={mood === 'happy' ? 6 : 9} />
          <path d="M83 115v11m54-11v11" stroke="#49443a" strokeWidth="4" /><circle cx="79" cy="117" r="2.2" fill="#fffdf5" stroke="none" /><circle cx="133" cy="117" r="2.2" fill="#fffdf5" stroke="none" />
        </g>
        <path d="M71 107q11-5 22 0m34 0q11-5 22 0" fill="none" stroke="#857866" strokeWidth="2" />
        <path d="M97 126q1 14 7 18m19-18q-1 14-7 18" fill="none" stroke="#b8a89b" strokeWidth="2" />
        <ellipse cx="99" cy="145" rx="12" ry="9" fill="#eee7db" stroke="none" /><ellipse cx="121" cy="145" rx="12" ry="9" fill="#eee7db" stroke="none" />
        <path d="M103 134q7-5 14 0-2 8-7 7-5 1-7-7z" fill="#b99591" stroke="#917976" strokeWidth="1.5" />
        <path d="M110 142v6q-7 10-14 0m14 0q7 10 14 0" fill="none" stroke="#978678" />
        {mood === 'happy' && <path d="M103 153q7 4 14 0-1 11-7 11t-7-11z" fill="#dca8a3" stroke="#aa837e" strokeWidth="1.3" />}
        <path d="m73 143-30-5m31 12-34 3m106-10 30-5m-31 12 34 3" stroke="#b9ac9c" strokeWidth="1.3" />
      </g>
    </svg>
  );
}
