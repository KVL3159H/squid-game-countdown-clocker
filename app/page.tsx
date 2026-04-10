'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const IMAGES = [
  '1.jpg','2.jpg','3.jpg','4.jpg','5.jpg',
  '6.jpg','7.jpg','8.jpg','9.jpg','10.jpg',
  '11.jpg','12.jpg','13.jpg','14.jpg','15.jpg',
  '16.jpg','17.jpg','18.jpg','19.jpg','20.jpg',
  '21.jpg','22.jpg','23.jpeg','24.jpeg','25.jpeg',
  '26.jpeg','27.jpeg','28.jpeg','29.webp','30.webp',
];

const TOTAL      = 7200;  // 2 hours
const IMG_EVERY  = 120;   // seconds per image
const DANGER_AT  = 600;   // last 10 min

const WARNINGS = [
  'TIME IS RUNNING OUT',
  'HURRY UP',
  'FINAL MINUTES',
  'MOVE FASTER',
  'SECONDS LEFT',
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
function fmt(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

/* ═══════════════════════════════════════════════════════════
   FULLSCREEN SIDEBAR BUTTON
═══════════════════════════════════════════════════════════ */
function FsButton() {
  const [isFs, setIsFs] = useState(false);

  useEffect(() => {
    const cb = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', cb);
    return () => document.removeEventListener('fullscreenchange', cb);
  }, []);

  const toggle = useCallback(async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else                              await document.exitFullscreen();
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="fs-sidebar">
      <button
        id="fs-toggle"
        className="fs-btn"
        onClick={toggle}
        aria-label={isFs ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFs ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {/* Squid Game symbol */}
        <svg className="fs-symbol" viewBox="0 0 100 100" fill="none">
          <circle   cx="50" cy="50" r="38"         stroke="#FF2E63" strokeWidth="5" />
          <polygon  points="50,16 84,72 16,72"      stroke="#FF2E63" strokeWidth="4" />
          <rect     x="30" y="30" width="40" height="40" stroke="#FF2E63" strokeWidth="3" />
        </svg>

        <div className="fs-divider" />

        {/* Expand / compress icon */}
        <svg className="fs-icon" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isFs ? (
            <>
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4"  />
              <line x1="10" y1="14" x2="3"  y2="21" />
              <line x1="21" y1="3"  x2="14" y2="10" />
            </>
          ) : (
            <>
              <polyline points="15 3 21 3 21 9"  />
              <polyline points="9 21 3 21 3 15"  />
              <line x1="21" y1="3"  x2="14" y2="10" />
              <line x1="3"  y1="21" x2="10" y2="14" />
            </>
          )}
        </svg>

        <div className="fs-divider" />
        <span className="fs-label">{isFs ? 'EXIT FS' : 'FULLSCREEN'}</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function SquidCTF() {
  type Screen = 'landing' | 'playing' | 'over';

  const [screen,       setScreen]       = useState<Screen>('landing');
  const [timeLeft,     setTimeLeft]     = useState(TOTAL);
  const [imgIdx,       setImgIdx]       = useState(0);   // current bg
  const [nextIdx,      setNextIdx]      = useState(1);   // next bg (for cross-fade)
  const [transitioning,setTransitioning]= useState(false);
  const [danger,       setDanger]       = useState(false);
  const [showEsc,      setShowEsc]      = useState(false);
  const [warning,      setWarning]      = useState('');
  const [shake,        setShake]        = useState(false);
  const [glitch,       setGlitch]       = useState(false);

  const playing      = useRef(false);
  const escTimeout   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimeout  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glitchTimeout= useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Fullscreen ESC detection ── */
  const onFsChange = useCallback(() => {
    if (!document.fullscreenElement && playing.current) {
      setShowEsc(true);
      if (escTimeout.current) clearTimeout(escTimeout.current);
      escTimeout.current = setTimeout(() => setShowEsc(false), 3000);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [onFsChange]);

  /* ── Enter game ── */
  const enterGame = useCallback(async () => {
    try { await document.documentElement.requestFullscreen(); } catch { /* ok */ }
    setScreen('playing');
    playing.current = true;
  }, []);

  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Image cross-fade ── */
  const rotateImage = useCallback(() => {
    setImgIdx(prevIdx => {
      const next = (prevIdx + 1) % IMAGES.length;
      setNextIdx(next);
      setTransitioning(true);
      
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
      transitionTimeout.current = setTimeout(() => {
        setImgIdx(next);
        setNextIdx((next + 1) % IMAGES.length);
        setTransitioning(false);
      }, 1600);
      
      return prevIdx; 
    });
  }, []);

  /* ── Countdown + image rotation ── */
  useEffect(() => {
    if (screen !== 'playing') return;

    const tick = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(tick);
          setScreen('over');
          playing.current = false;
          if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const imgTimer = setInterval(rotateImage, IMG_EVERY * 1000);

    return () => {
      clearInterval(tick);
      clearInterval(imgTimer);
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, [screen, rotateImage]);

  /* ── Danger mode ── */
  useEffect(() => {
    setDanger(timeLeft <= DANGER_AT && screen === 'playing');
  }, [timeLeft, screen]);

  /* ── Danger random effects ── */
  useEffect(() => {
    if (!danger || screen !== 'playing') return;

    const warnTick = setInterval(() => {
      if (Math.random() < 0.5) {
        const msg = WARNINGS[Math.floor(Math.random() * WARNINGS.length)];
        setWarning(msg);
        if (warnTimeout.current) clearTimeout(warnTimeout.current);
        warnTimeout.current = setTimeout(() => setWarning(''), 1100);
      }
    }, 7000);

    const shakeTick = setInterval(() => {
      if (Math.random() < 0.35) {
        setShake(true);
        if (shakeTimeout.current) clearTimeout(shakeTimeout.current);
        shakeTimeout.current = setTimeout(() => setShake(false), 460);
      }
    }, 5000);

    return () => {
      clearInterval(warnTick);
      clearInterval(shakeTick);
    };
  }, [danger, screen]);

  /* ── Occasional glitch flash ── */
  useEffect(() => {
    if (screen !== 'playing') return;
    const t = setInterval(() => {
      if (Math.random() < 0.38) {
        setGlitch(true);
        if (glitchTimeout.current) clearTimeout(glitchTimeout.current);
        glitchTimeout.current = setTimeout(() => setGlitch(false), 320);
      }
    }, danger ? 14000 : 42000);
    return () => {
      clearInterval(t);
      if (glitchTimeout.current) clearTimeout(glitchTimeout.current);
    };
  }, [screen, danger]);

  const progress = ((TOTAL - timeLeft) / TOTAL) * 100;

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <>
      {/* ── LAYER 0 & 1 : Background images (only 2 rendered at once) ── */}
      <div
        className="bg-current"
        style={{ backgroundImage: `url('/${IMAGES[imgIdx]}')` }}
        aria-hidden="true"
      />
      <div
        className={`bg-next${transitioning ? ' visible' : ''}`}
        style={{ backgroundImage: `url('/${IMAGES[nextIdx]}')` }}
        aria-hidden="true"
      />

      {/* ── LAYER 2 : Dark overlay ── */}
      <div className="overlay-dark" aria-hidden="true" />

      {/* ── LAYER 3 : Vignette ── */}
      <div className="overlay-vignette" aria-hidden="true" />

      {/* ── LAYER 4 : Grain ── */}
      <div className="overlay-grain" aria-hidden="true" />

      {/* ════════════════════════════════════
          LAYER 10 — LANDING
      ════════════════════════════════════ */}
      <main className={`landing${screen !== 'landing' ? ' hidden' : ''}`}>

        {/* Squid symbol row */}
        <div className="symbol-row">
          <div className="symbol-line" />
          <svg className="symbol-svg" viewBox="0 0 100 100" fill="none">
            <circle  cx="50" cy="50" r="40"         stroke="#FF2E63" strokeWidth="4" opacity="0.85" />
            <polygon points="50,18 82,72 18,72"      stroke="#FF2E63" strokeWidth="3" opacity="0.65" />
            <rect    x="28" y="28" width="44" height="44" stroke="#FF2E63" strokeWidth="2" opacity="0.45" />
          </svg>
          <div className="symbol-line" />
        </div>

        <p className="landing-tagline">YOU HAVE BEEN SELECTED</p>

        <h1 className="landing-title">SQUID GAME</h1>
        <p className="landing-ctf">CTF</p>

        <p className="landing-sub">
          Survive 2 hours.<br />Solve or be eliminated.
        </p>

        <button id="enter-btn" className="enter-btn" onClick={enterGame}>
          ENTER THE GAME
        </button>
      </main>

      {/* ════════════════════════════════════
          LAYER 10 — GAME SCREEN
      ════════════════════════════════════ */}
      <section
        className={`game-screen${screen !== 'playing' ? ' hidden' : ''}${shake ? ' shake' : ''}`}
        aria-hidden={screen !== 'playing'}
      >
        {/* Timer block */}
        <div className="timer-block">
          <div className="game-title">SQUID GAME CTF</div>

          <div
            className={`timer${danger ? ' danger' : ''}`}
            role="timer"
            aria-live="polite"
            aria-label={`Time remaining: ${fmt(timeLeft)}`}
          >
            {fmt(timeLeft)}
          </div>

          <div className={`timer-sub${danger ? ' danger-sub' : ''}`}>
            {danger ? '⚠ DANGER ZONE — MOVE NOW' : 'COMPETE. SURVIVE. WIN.'}
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />

        {/* Status pill */}
        <div className="status-row">
          <div className={`status-pill${danger ? ' danger' : ''}`}>
            {danger ? '⚠ CRITICAL — FINAL MINUTES' : '● LIVE CTF IN PROGRESS'}
          </div>
        </div>
      </section>

      {/* ── LAYER 20 : Danger overlay ── */}
      <div
        className={`danger-overlay${danger && screen === 'playing' ? ' active' : ''}`}
        aria-hidden="true"
      />

      {/* ── LAYER 21 : Glitch flash ── */}
      {glitch && <div className="glitch-flash" aria-hidden="true" />}

      {/* ── LAYER 30 : Warning text ── */}
      {warning && screen === 'playing' && (
        <div className="warning-text" role="alert" aria-live="assertive" key={warning}>
          {warning}
        </div>
      )}

      {/* ── LAYER 40 : ESC overlay ── */}
      <div
        className={`esc-overlay${showEsc ? ' visible' : ''}`}
        role="alertdialog"
        aria-hidden={!showEsc}
      >
        <p className="esc-text">YOU CANNOT<br />ESCAPE THE GAME.</p>
      </div>

      {/* ── LAYER 50 : Game over ── */}
      <div
        className={`gameover-screen${screen === 'over' ? ' active' : ''}`}
        role="dialog"
        aria-hidden={screen !== 'over'}
      >
        <div className="eliminated">ELIMINATED</div>
        <p className="eliminated-sub">PLAYER 067 · TIME HAS EXPIRED · GAME OVER</p>
      </div>

      {/* ── LAYER 60 : Fullscreen sidebar ── */}
      <FsButton />
    </>
  );
}
