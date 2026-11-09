import { lazy, Suspense, useState } from 'react';
import CafeScene from './CafeScene';
import MemoryCafe from './MemoryCafe';
import CafeStudio from './CafeStudio';
import { DesignScene } from './StudioArtwork';
import { createDesign, decodeMemoryDesign, MEMORY_DESIGN_KEY, publishDesign } from './studioModel';
import type { Design, MemoryDesignSetting } from './studioModel';

const preview = createDesign();
const Cafe3D = lazy(() => import('./Cafe3D'));

function loadMemoryDesign(): { setting: MemoryDesignSetting | null; error: string } {
  try {
    const raw = localStorage.getItem(MEMORY_DESIGN_KEY);
    return { setting: raw ? decodeMemoryDesign(JSON.parse(raw)) : null, error: '' };
  } catch (error) {
    console.error('Could not restore the Memory Cafe design.', error);
    return { setting: null, error: 'Your Memory Cafe appearance could not be restored. The original cafe is shown; your quiz progress is unaffected. Reapply a design from the studio to replace the unreadable appearance save.' };
  }
}

export default function App() {
  const [game, setGame] = useState<'home' | 'memory' | 'studio'>('home');
  const [restored] = useState(loadMemoryDesign);
  const [memoryDesign, setMemoryDesign] = useState(restored.setting);
  const [appearanceNotice, setAppearanceNotice] = useState(restored.error);
  const activeDesign = memoryDesign?.enabled ? memoryDesign.design : null;
  const saveAppearance = (setting: MemoryDesignSetting): string | null => {
    try {
      localStorage.setItem(MEMORY_DESIGN_KEY, JSON.stringify(setting));
      setMemoryDesign(setting);
      setAppearanceNotice('');
      return null;
    } catch (error) {
      console.error('Could not save the Memory Cafe appearance.', error);
      return 'Your Memory Cafe appearance could not be saved. Check browser storage permissions or available space, then try again. The previous appearance and quiz progress have not changed.';
    }
  };
  const applyDesign = (design: Design): string | null => {
    const error = saveAppearance(publishDesign(design));
    if (!error) setGame('memory');
    return error;
  };
  const notice = appearanceNotice && <div className="studio-notice" role="alert"><p>{appearanceNotice}</p><button aria-label="Dismiss appearance notice" onClick={() => setAppearanceNotice('')}>x</button></div>;
  if (game === 'memory') return <>{notice}<MemoryCafe
    background={activeDesign ? <Suspense fallback={<DesignScene design={activeDesign} className="cafe-room-art" />}><Cafe3D design={activeDesign} backdrop onError={setAppearanceNotice} /></Suspense> : <CafeScene />}
    appearanceRoom={activeDesign?.room}
    appearanceControls={memoryDesign && <button className="small-button game-appearance-button" aria-pressed={memoryDesign.enabled} onClick={() => {
      const error = saveAppearance({ ...memoryDesign, enabled: !memoryDesign.enabled });
      if (error) setAppearanceNotice(error);
    }}>{memoryDesign.enabled ? 'Original cafe' : 'My design'}</button>}
    onExit={() => setGame('home')} /></>;
  if (game === 'studio') return <>{notice}<CafeStudio onExit={() => setGame('home')} onApplyDesign={applyDesign} /></>;
  return <main className="game-chooser">
    {notice}
    <header className="chooser-header"><span>Good Sarah, Great Sarah.</span><span>A little birthday world, just for you.</span></header>
    <section className="chooser-intro"><span className="studio-kicker">For the memories. For the imagination.</span><h1>Your kind of <em>happy place.</em></h1><p>A familiar story to play through, or a little world to make your own.<br />What are we in the mood for today, Sarah?</p></section>
    <section className="chooser-games" aria-label="Choose a game">
      <button className="chooser-card" onClick={() => setGame('memory')}>
        <span className="chooser-card-art">{activeDesign ? <DesignScene design={activeDesign} /> : <CafeScene />}<span className="chooser-card-tag">{activeDesign ? 'Your design / 29 memories' : 'The original / 29 memories'}</span></span>
        <span className="chooser-card-body"><span className="studio-kicker">Brew a little nostalgia</span><strong className="chooser-card-title">Memory Cafe</strong><span className="chooser-card-description">Your stories, freshly brewed. Familiar faces, playful recipes, and a birthday surprise waiting at the end.</span><span className="chooser-card-footer">Open the memory cafe <b aria-hidden="true">&rarr;</b></span></span>
      </button>
      <button className="chooser-card" onClick={() => setGame('studio')}>
        <span className="chooser-card-art chooser-card-art--studio"><DesignScene design={preview} /><span className="chooser-card-tag">New / made for your designer heart</span></span>
        <span className="chooser-card-body"><span className="studio-kicker">Dream it. Design it. Stay awhile.</span><strong className="chooser-card-title">Cafe Design Studio</strong><span className="chooser-card-description">From the floor beneath your feet to the flowers on the table. Design a cafe that feels completely, wonderfully you.</span><span className="chooser-card-footer">Step inside your studio <b aria-hidden="true">&rarr;</b></span></span>
      </button>
    </section>
    <footer className="chooser-footer">Made with love, for all the little things you make beautiful.</footer>
  </main>;
}
