import { useEffect, useRef, useState } from 'react';

const MUSIC_KEY = 'good-sarah-music-v1';
const TRACK_URL = `${import.meta.env.BASE_URL}audio/cafe-main-theme.mp3`;

function readPreferences(): { enabled: boolean; volume: number } {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(MUSIC_KEY) ?? 'null');
    if (saved && typeof saved === 'object' && 'enabled' in saved && 'volume' in saved &&
      typeof saved.enabled === 'boolean' && typeof saved.volume === 'number' &&
      Number.isFinite(saved.volume) && saved.volume >= 0 && saved.volume <= 1) {
      return { enabled: saved.enabled, volume: saved.volume };
    }
    return { enabled: true, volume: 0.25 };
  } catch (error) {
    console.warn('Could not restore café music preferences.', error);
    return { enabled: true, volume: 0.25 };
  }
}

export default function BackgroundMusic() {
  const [preferences, setPreferences] = useState(readPreferences);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const audio = useRef<HTMLAudioElement>(null);
  const enabled = useRef(preferences.enabled);
  const interacted = useRef(false);

  const play = async () => {
    const track = audio.current;
    if (!track || !enabled.current || document.hidden) return;
    try {
      await track.play();
      if (!enabled.current || document.hidden) track.pause();
      setError('');
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') return;
      console.warn('Café music playback failed.', cause);
      setError(cause instanceof DOMException && cause.name === 'NotAllowedError'
        ? 'Tap Music to allow background playback.'
        : 'The music could not play. Tap Music to retry.');
    }
  };
  const playRef = useRef(play);
  playRef.current = play;

  useEffect(() => {
    const track = audio.current!;
    track.volume = preferences.volume;
    try {
      localStorage.setItem(MUSIC_KEY, JSON.stringify(preferences));
    } catch (cause) {
      console.warn('Could not save café music preferences.', cause);
      setError('Music works, but this browser could not save your sound settings.');
    }
  }, [preferences]);

  useEffect(() => {
    const track = audio.current!;
    const onInteraction = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') return;
      if (interacted.current) return;
      interacted.current = true;
      void playRef.current();
    };
    const onVisibilityChange = () => {
      if (document.hidden) track.pause();
      else if (interacted.current) void playRef.current();
    };
    document.addEventListener('pointerdown', onInteraction);
    document.addEventListener('keydown', onInteraction);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('pointerdown', onInteraction);
      document.removeEventListener('keydown', onInteraction);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      track.pause();
    };
  }, []);

  const toggle = () => {
    if (playing) {
      enabled.current = false;
      audio.current?.pause();
      setPreferences((current) => ({ ...current, enabled: false }));
      setError('');
    } else {
      enabled.current = true;
      interacted.current = true;
      setPreferences((current) => ({ ...current, enabled: true }));
      void play();
    }
  };

  return (
    <div className="music-controls">
      <audio ref={audio} src={TRACK_URL} loop preload="auto"
        onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onError={() => {
          console.error('Café soundtrack could not be loaded.', audio.current?.error);
          setPlaying(false);
          setError('The soundtrack could not load. Check the connection and reload to retry.');
        }} />
      <button className={`small-button music-toggle${playing ? ' music-toggle--playing' : ''}`}
        aria-label={playing ? 'Turn music off' : 'Turn music on'} aria-pressed={playing} onClick={toggle}>
        <span aria-hidden="true">♫</span><span>Music {playing ? 'on' : 'off'}</span>
      </button>
      <details className="music-settings">
        <summary aria-label="Music volume settings" title="Music volume settings">☷</summary>
        <div className="music-settings-panel">
          <label htmlFor="music-volume">Café music <span>{Math.round(preferences.volume * 100)}%</span></label>
          <input id="music-volume" type="range" min="0" max="1" step="0.05" value={preferences.volume}
            onChange={(event) => setPreferences((current) => ({ ...current, volume: Number(event.target.value) }))} />
          <p>Loops softly. Pauses when you leave this tab.</p>
        </div>
      </details>
      {error && <div className="music-error" role="alert">{error}<button onClick={() => setError('')} aria-label="Dismiss music message">×</button></div>}
    </div>
  );
}
