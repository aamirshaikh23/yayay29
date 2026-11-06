import { useEffect, useReducer, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { birthdayConfig } from './birthdayConfig';
import { CafeMark, CakeArt, DrinkArt, IngredientArt } from './CafeArtwork';
import CafeHost from './CafeHost';
import BackgroundMusic from './BackgroundMusic';
import { cafeReducer, decodeSave, MAX_CUP_INGREDIENTS, newGame, PATIENCE_MS, resultTitle, SAVE_KEY } from './game';
import type { CafeState } from './game';
import { chapters, hasDrinkBase, ingredientName, ingredients, memoryOrders } from './memoryOrders';

type Modal = 'book' | 'pause' | 'restart';

function loadGame(): { state: CafeState; notice: string } {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    return { state: saved ? decodeSave(JSON.parse(saved)) : newGame(), notice: '' };
  } catch (error) {
    console.error('Could not restore the memory café.', error);
    return { state: newGame(), notice: 'Your saved café could not be restored. A fresh birthday shift is ready.' };
  }
}

function CafeDialog({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog className="cafe-dialog" ref={ref} aria-label={title} onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <div className="dialog-heading"><span className="eyebrow">Good Sarah, Great Sarah</span><button className="icon-button" onClick={onClose} aria-label="Close dialog">×</button></div>
      <h2>{title}</h2>
      {children}
    </dialog>
  );
}

export default function MemoryCafe({ background }: { background: ReactNode }) {
  const [restored] = useState(loadGame);
  const [game, dispatch] = useReducer(cafeReducer, restored.state);
  const [notice, setNotice] = useState(restored.notice);
  const [modal, setModal] = useState<Modal | null>(null);
  const [bookTab, setBookTab] = useState<'guide' | 'memories'>('guide');
  const order = memoryOrders[game.orderIndex];
  const chapter = chapters[order.chapter];
  const receipt = game.receipts[game.orderIndex];
  const tips = game.receipts.reduce((total, item) => total + item.tip, 0);
  const perfect = game.receipts.filter((item) => item.accuracy === 100).length;
  const combo = game.receipts.at(-1)?.combo ?? 0;
  const bestCombo = Math.max(0, ...game.receipts.map((item) => item.combo));
  const average = game.receipts.length
    ? Math.round(game.receipts.reduce((total, item) => total + item.accuracy, 0) / game.receipts.length) : 0;
  const activeModal = modal ?? (game.paused && game.screen === 'play' ? 'pause' : null);
  const running = game.screen === 'play' && !receipt && !activeModal && !game.paused;
  const hasBase = hasDrinkBase(game.cup);
  const completedChapters = chapters.filter((_, index) =>
    game.receipts.length > 0 && game.receipts.length >= memoryOrders.filter((item) => item.chapter <= index).length,
  ).length;

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(game));
    } catch (error) {
      console.error('Could not save the memory café.', error);
      setNotice('Saving is unavailable in this browser. You can play, but progress may be lost on refresh.');
    }
  }, [game]);

  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      if (!document.hidden) dispatch({ type: 'TICK', elapsedMs: now - last });
      last = now;
    }, 250);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden && game.screen === 'play' && !receipt) dispatch({ type: 'PAUSE', paused: true });
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [game.screen, receipt]);

  const closeModal = () => {
    setModal(null);
    if (game.paused) dispatch({ type: 'PAUSE', paused: false });
  };
  const openBook = () => { setBookTab('guide'); setModal('book'); };
  const reset = () => { dispatch({ type: 'RESTART' }); setModal(null); };
  const missing = receipt ? order.recipe.filter((id) => !receipt.cup.includes(id)) : [];
  const extra = receipt ? receipt.cup.filter((id) => !order.recipe.includes(id)) : [];

  return (
    <main className={`memory-cafe memory-cafe--${game.screen}`}>
      <header className="cafe-header">
        <div className="cafe-brand"><CafeMark /><span>Good Sarah,<br /><strong>Great Sarah</strong></span></div>
        <div className="header-note">a birthday café, just for you</div>
        <div className="header-actions">
          <BackgroundMusic />
          <button className="small-button" onClick={openBook}>Memory book <span aria-hidden="true">✧</span></button>
          <button className="icon-button" onClick={() => setModal(game.screen === 'play' ? 'pause' : 'restart')} aria-label={game.screen === 'play' ? 'Pause game' : 'Start a new game'}>{game.screen === 'play' ? 'Ⅱ' : '↺'}</button>
        </div>
      </header>

      {notice && <div className="save-notice" role="alert">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss saving notice">×</button></div>}

      <section className="cafe-world" aria-label="Sarah's memory café">
        <div className="room-backdrop" aria-hidden="true">{background}</div>
        <div className="room-warmth" aria-hidden="true" />
        {completedChapters > 0 && <div className="earned-decorations" aria-label={`${completedChapters} birthday decorations unlocked`}>
          {completedChapters >= 1 && <div className="decoration-photo"><span>Sarah<br />& Aamir</span><span aria-hidden="true">♡</span></div>}
          {completedChapters >= 2 && <div className="decoration-flowers" aria-label="Flowers unlocked"><svg viewBox="0 0 90 100" aria-hidden="true"><path d="M37 68 23 24m21 44 5-51m1 52 21-40" fill="none" stroke="#7f9a71" strokeWidth="3" /><path d="M27 67h38l-5 30H32z" fill="#e1ae94" stroke="#855c42" strokeWidth="2" />{[[23, 24], [49, 17], [71, 29]].map(([x, y]) => <g key={x}><path d={`M${x} ${y - 10}q16-10 10 5 15 10-3 13-7 16-14-1-18-6-3-13z`} fill="#e9be9a" stroke="#b37c5f" strokeWidth="1.5" /><circle cx={x} cy={y} r="4" fill="#dcaf5b" /></g>)}</svg></div>}
          {completedChapters >= 3 && <div className="decoration-lights">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div>}
          {completedChapters >= 4 && <div className="decoration-garland">H A P P Y &nbsp; B I R T H D A Y</div>}
        </div>}

        {game.screen === 'welcome' && <div className="welcome-scene">
          <div className="shop-sign"><span className="sign-overline">Birthday special · <time dateTime={birthdayConfig.birthdayDate}>{birthdayConfig.birthdayDateLabel}</time></span><h1>{birthdayConfig.welcomeLine}</h1><span className="sign-flourish">♡ &nbsp; a café full of us &nbsp; ♡</span></div>
          <div className="welcome-owner"><CafeHost name="Aamir" /><div className="welcome-olive"><CafeHost name="Olive" /></div></div>
          <div className="welcome-invitation speech-paper">
            <span className="speaker-name">A very special shift</span>
            <h2>{birthdayConfig.name}, your café is waiting.</h2>
            <p>Your stories, freshly brewed. Matcha for you, dessert for Aamir, and Olive running the night shift.<br />Brew your way to a birthday surprise.</p>
            <button className="cafe-button" onClick={() => dispatch({ type: 'START' })}>Open the café <span aria-hidden="true">→</span></button>
            <span className="welcome-details">2 familiar faces · 29 memories · 5 chapters</span>
          </div>
          <div className="birthday-seal">{birthdayConfig.age}<small>& lovely</small></div>
        </div>}

        {game.screen === 'intro' && <div className="story-scene">
          <CafeHost name="Aamir" />
          <div className="story-paper speech-paper">
            <span className="speaker-name">Aamir · with Olive supervising</span>
            <h1>{birthdayConfig.introLines[0]}</h1>
            {birthdayConfig.introLines.slice(1).map((line) => <p key={line}>{line}</p>)}
            <div className="how-to-strip"><span>01 Listen</span><span>02 Brew & stir</span><span>03 Serve with love</span></div>
            <button className="cafe-button" onClick={() => dispatch({ type: 'INTRO_DONE' })}>Apron on. Let’s do this <span aria-hidden="true">→</span></button>
            <p className="sample-note">Real Sarah & Aamir memories. Playful café recipes. Drinks are for humans; Olive has his own menu.</p>
          </div>
        </div>}

        {game.screen === 'chapter' && <div className="chapter-scene">
          <div className="chapter-paper speech-paper">
            <p className="eyebrow">Chapter {order.chapter + 1} of {chapters.length}</p>
            <div className="chapter-emblem"><CafeMark /></div>
            <h1>{chapter.title}</h1><p>{chapter.subtitle}</p>
            <div className="chapter-reward"><span aria-hidden="true">✧</span><span>Finish this chapter to unlock<br /><strong>{chapter.reward.toLowerCase()}</strong></span></div>
            <button className="cafe-button" onClick={() => dispatch({ type: 'OPEN_COUNTER' })}>A memory with {order.customer} <span aria-hidden="true">→</span></button>
            <span className="welcome-details">Your tips: {tips} · Your perfect drinks: {perfect}</span>
          </div>
          <CafeHost name={order.customer} />
        </div>}

        {game.screen === 'play' && <div className="play-scene">
          <div className="cafe-hud">
            <div className="hud-day"><small>CHAPTER {order.chapter + 1}</small><strong>{chapter.title}</strong></div>
            <div className="hud-pill"><span aria-hidden="true">◎</span><strong>{tips}</strong><small>tips</small></div>
            <div className={`hud-pill combo-pill${combo >= 2 ? ' combo-pill--active' : ''}`}><span aria-hidden="true">✦</span><strong>{combo}×</strong><small>combo</small></div>
            <div className="hud-order"><strong>{String(game.orderIndex + 1).padStart(2, '0')}</strong><span> / {memoryOrders.length}<small>memories</small></span></div>
          </div>

          <div className="customer-scene" key={order.id}>
            <div className="guest-position"><CafeHost name={order.customer} mood={!receipt ? 'waiting' : receipt.accuracy === 100 ? 'happy' : 'oops'} /></div>
            <div className="guest-dialogue speech-paper">
              <span className="speaker-name">{order.customer}<span>{receipt ? 'the verdict' : 'today’s memory order'}</span></span>
              <h1>{receipt
                ? receipt.timedOut ? order.customer === 'Olive'
                    ? 'Meow. I have an urgent food-bowl inspection. We can try another memory next!'
                    : 'I got distracted looking for my wallet. Let’s start fresh with the next memory!'
                  : receipt.accuracy === 100 ? order.success
                    : 'A creative little brew! Not quite my memory, but every barista has a plot twist.'
                : order.dialogue}</h1>
              {!receipt && <div className={`patience-row${game.remainingMs < 25_000 ? ' patience-row--low' : ''}`}>
                <span>Patience</span><div className="patience-track" role="progressbar" aria-label="Customer patience" aria-valuenow={Math.ceil(game.remainingMs / 1000)} aria-valuemin={0} aria-valuemax={PATIENCE_MS / 1000}><div style={{ width: `${game.remainingMs / PATIENCE_MS * 100}%` }} /></div><strong>{Math.ceil(game.remainingMs / 1000)}s</strong>
              </div>}
              {!receipt && game.orderIndex === 0 && <p className="first-order-help">Need a clue? The memory book translates the flavours. Its clock is always paused.</p>}
            </div>
          </div>

          <div className={`barista-counter${receipt ? ' barista-counter--receipt' : ''}`}>
            <div className="counter-rim"><span>GOOD MEMORIES, FRESHLY BREWED</span><span>{receipt ? 'Served with love' : 'Your little workstation'}</span></div>
            <div className="counter-content">
              <div className="cup-station">
                <div className="order-ticket"><span>ORDER {String(game.orderIndex + 1).padStart(2, '0')}</span><strong>{order.drink}</strong><small>{receipt ? 'Thank you, Sarah!' : 'One cup. One little story.'}</small></div>
                <div className="drink-on-mat" key={`${order.id}-${game.cup.length}`}>
                  <DrinkArt cup={game.cup} stirred={game.stirred} serving={Boolean(receipt)} />
                  <span className="cup-status">{receipt ? 'Made with love' : game.stirred ? 'Stirred & ready to serve' : game.cup.length ? 'Add your flavours, then stir' : 'Start with matcha, espresso or tea'}</span>
                </div>
                {!receipt && <div className="cup-edit"><button className="small-button" disabled={!game.cup.length} onClick={() => dispatch({ type: 'UNDO' })}>Undo last</button><button className="small-button" disabled={!game.cup.length} onClick={() => dispatch({ type: 'CLEAR' })}>Empty cup</button></div>}
              </div>

              {!receipt ? <div className="ingredient-station">
                <div className="station-heading"><div><p className="eyebrow">A pinch of this, a splash of that</p><h2>Make a memory</h2></div><span className="ingredient-count">{game.cup.length}/{MAX_CUP_INGREDIENTS} ingredients</span></div>
                <div className="ingredient-shelf" role="group" aria-label="Drink ingredients">
                  {ingredients.map((ingredient) => <button
                    key={ingredient.id} className={`ingredient-button${game.cup.includes(ingredient.id) ? ' ingredient-button--added' : ''}`}
                    aria-label={ingredient.action} disabled={game.cup.includes(ingredient.id) || game.cup.length >= MAX_CUP_INGREDIENTS}
                    onClick={() => dispatch({ type: 'ADD', ingredient: ingredient.id })}>
                    <IngredientArt id={ingredient.id} /><span>{ingredient.name}</span><small>{game.cup.includes(ingredient.id) ? '✓ added' : ingredient.id === 'espresso' ? 'brew a shot' : ingredient.id === 'tea' ? 'steep a little' : '+ add to cup'}</small>
                  </button>)}
                </div>
                <div className="cup-contents" role="status" aria-label="Current cup contents">{game.cup.length ? game.cup.map(ingredientName).join(' + ') : 'Your cup is empty. Follow Aamir or Olive’s clues.'}</div>
                <div className="barista-actions"><button className="stir-button" disabled={!hasBase || game.stirred} onClick={() => dispatch({ type: 'STIR' })}>{game.stirred ? '✓ Stirred' : '↻ Give it a stir'}</button><button className="cafe-button serve-button" disabled={!game.stirred} onClick={() => dispatch({ type: 'SERVE' })}>Serve drink <span aria-hidden="true">→</span></button></div>
              </div> : <div className="receipt-paper" role="status">
                <p className="eyebrow">{receipt.timedOut ? 'A little missed connection' : receipt.accuracy === 100 ? 'A perfectly brewed memory' : 'A little room for a remake next time'}</p>
                <h2>{receipt.accuracy === 100 ? 'You remembered.' : receipt.timedOut ? 'The next cup is a fresh start.' : 'Still made with love.'}</h2>
                <div className="receipt-numbers"><div><strong>{receipt.accuracy}%</strong><span>accuracy</span></div><div><strong>+{receipt.tip}</strong><span>tip coins</span></div><div><strong>{receipt.combo}×</strong><span>combo</span></div></div>
                {(missing.length > 0 || extra.length > 0) && <div className="recipe-correction">{missing.length > 0 && <p><strong>Missing:</strong> {missing.map(ingredientName).join(', ')}</p>}{extra.length > 0 && <p><strong>A little extra:</strong> {extra.map(ingredientName).join(', ')}</p>}</div>}
                {receipt.usedHint && <p className="receipt-note">Memory hint used: −2 tip coins.</p>}
                {receipt.accuracy === 100 && receipt.combo > 1 && <p className="receipt-note">Perfect streak! Combo bonus: +{Math.min(receipt.combo - 1, 4) * 2} coins.</p>}
                <div className="served-memory"><p className="eyebrow">From our little memory book</p><p>{order.memory}</p></div>
                <button className="cafe-button" onClick={() => dispatch({ type: 'NEXT' })}>{game.orderIndex === memoryOrders.length - 1 ? 'Close the café & celebrate' : 'The next little memory'} <span aria-hidden="true">→</span></button>
              </div>}
            </div>
            <div className="counter-front"><span>{perfect} perfect cups</span><div className="shift-progress" role="progressbar" aria-label="Birthday shift progress" aria-valuenow={game.receipts.length} aria-valuemin={0} aria-valuemax={memoryOrders.length}><div style={{ width: `${game.receipts.length / memoryOrders.length * 100}%` }} /></div><span>{game.receipts.length}/{memoryOrders.length} memories served</span></div>
          </div>
        </div>}

        {game.screen === 'results' && <div className="finale-scene">
          <div className="finale-paper speech-paper">
            <div className="cake-illustration"><CakeArt /></div><p className="eyebrow">The birthday shift is complete</p>
            <h1>29 little memories.<br />One favourite person.</h1><p className="barista-title">{resultTitle(perfect)}</p>
            <div className="final-stats"><div><strong>{tips}</strong><span>tip coins</span></div><div><strong>{perfect}/29</strong><span>perfect drinks</span></div><div><strong>{bestCombo}×</strong><span>best combo</span></div></div>
            <p>Average drink accuracy: {average}%.<br />All five birthday decorations are unlocked. Now for the real reason everyone came...</p>
            <button className="cafe-button" onClick={() => dispatch({ type: 'SURPRISE' })}>A little something for Sarah <span aria-hidden="true">♡</span></button>
          </div>
        </div>}

        {game.screen === 'surprise' && <div className="finale-scene">
          <div className="finale-paper speech-paper">
            <div className="birthday-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ left: `${i * 5.7}%`, animationDelay: `${i * .17}s`, background: ['#b2c19a', '#dfb39b', '#e7ca7b'][i % 3] }} />)}</div>
            <div className="cake-illustration"><CakeArt /></div><p className="eyebrow">With all the love in the world</p>
            <h1>{birthdayConfig.birthdayMessage}</h1><p className="birthday-letter">{birthdayConfig.finalMessage}</p>
            {game.surpriseRevealed ? <div className="dedication" role="status">{birthdayConfig.lastSurprise}</div> : <button className="cafe-button" onClick={() => dispatch({ type: 'REVEAL' })}>One more surprise <span aria-hidden="true">♡</span></button>}
            <button className="link-button" onClick={() => setModal('restart')}>Another little shift?</button>
          </div>
        </div>}
      </section>

      <footer className="cafe-footer"><span>Made with a little sugar & a lot of love</span><span>{game.screen === 'play' ? 'The café pauses when you step away.' : `For ${birthdayConfig.name} · ${birthdayConfig.birthdayDateLabel} · ${birthdayConfig.age} & lovely`}</span></footer>

      {activeModal === 'book' && <CafeDialog title="The little memory book" onClose={closeModal}>
        <p className="book-intro">The clock is paused. Aamir and Olive are your only hosts. Follow their clues to find each memory’s blend. Olive supervises drinks for humans, never drinks them.</p>
        <div className="book-tabs"><button className={bookTab === 'guide' ? 'is-active' : ''} onClick={() => setBookTab('guide')}>Flavour guide</button><button className={bookTab === 'memories' ? 'is-active' : ''} onClick={() => setBookTab('memories')}>Today’s memory</button></div>
        {bookTab === 'guide' ? <>
          <div className="flavour-guide">{ingredients.map((ingredient) => <div key={ingredient.id}><IngredientArt id={ingredient.id} /><p><strong>{ingredient.name}</strong><span>{ingredient.meaning}</span></p></div>)}</div>
          <p className="book-rule">Start with matcha, espresso or tea. Tap each ingredient once. Ingredients can go in any order. Stir after the last addition, then serve. Undo and empty cup are free.</p>
          <p className="book-rule">Perfect drinks build a combo (up to +8 bonus coins). Serve with over 50s left for +2 speed coins. If patience runs out, the guest leaves; your birthday surprise is never locked.</p>
        </> : game.screen === 'play' ? <div className="memory-hint">
          <p className="eyebrow">Order {game.orderIndex + 1} · {order.drink}</p>
          {game.usedHint || receipt ? <><h3>The story behind the cup</h3><p>{order.memory}</p><p><strong>The blend:</strong> {order.recipe.map(ingredientName).join(' + ')}. Stir before serving.</p></> : <><h3>A little nudge?</h3><p>Reveal your memory and its playful recipe. It costs 2 coins from this drink’s tip, but your perfect-drink combo is safe.</p><button className="cafe-button" onClick={() => dispatch({ type: 'HINT' })}>Peek at the memory (−2 tip coins)</button></>}
        </div> : <p className="book-rule">Aamir or Olive will bring your next memory. Open this page while making a drink if you need a hint.</p>}
        <p className="sample-note">Stories from Aamir, starring Sarah (and Olive). The recipes are little game tributes, not a record of what you actually ordered on your trips. Saudi is the next adventure, not a past one.</p>
        <button className="small-button book-close" onClick={closeModal}>Back to the café</button>
      </CafeDialog>}

      {activeModal === 'pause' && <CafeDialog title="A little coffee break." onClose={closeModal}>
        <div className="break-art"><CafeMark /></div><p>Take a breath, lovely. Your guest, your cup, and the clock will be right here.</p>
        <button className="cafe-button" onClick={closeModal}>Back behind the counter <span aria-hidden="true">→</span></button>
        <button className="link-button" onClick={() => setModal('restart')}>Start a fresh birthday shift</button>
      </CafeDialog>}
      {activeModal === 'restart' && <CafeDialog title="A fresh little start?" onClose={closeModal}>
        <p>This will reset your drinks, tips, and birthday decorations. Your current progress will be replaced.</p>
        <div className="confirm-actions"><button className="small-button" onClick={closeModal}>Keep my café</button><button className="cafe-button" onClick={reset}>Start fresh</button></div>
      </CafeDialog>}
    </main>
  );
}
