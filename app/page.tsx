'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Image list (30 images in public/) ────────────────────────────────────
const IMAGES: string[] = [
  '1.jpg','2.jpg','3.jpg','4.jpg','5.jpg',
  '6.jpg','7.jpg','8.jpg','9.jpg','10.jpg',
  '11.jpg','12.jpg','13.jpg','14.jpg','15.jpg',
  '16.jpg','17.jpg','18.jpg','19.jpg','20.jpg',
  '21.jpg','22.jpg','23.jpeg','24.jpeg','25.jpeg',
  '26.jpeg','27.jpeg','28.jpeg','29.webp','30.webp',
];

const TOTAL_TIME = 7200; // 2 hours in seconds
const IMAGE_INTERVAL = 120; // change image every 2 minutes
const DANGER_THRESHOLD = 600; // last 10 minutes
const WARNING_MESSAGES = ['TIME IS RUNNING OUT', 'HURRY UP', 'FINAL MINUTES', 'MOVE FASTER', 'SECONDS LEFT'];
const PLAYER_ID = 'PLAYER 067';

// ─── Helper: format time ─────────────────────────────────────────────────
function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── SVG Shapes ─────────────────────────────────────────────────────────
function SquidShapes() {
  return (
    <div className="symbol-container">
      <div className="symbol-line" />
      <svg className="symbol" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Circle */}
        <circle cx="50" cy="50" r="40" stroke="#FF2E63" strokeWidth="4" fill="none" opacity="0.8" />
        {/* Triangle */}
        <polygon points="50,18 82,72 18,72" stroke="#FF2E63" strokeWidth="3" fill="none" opacity="0.6" />
        {/* Square (rotated) */}
        <rect x="28" y="28" width="44" height="44" stroke="#FF2E63" strokeWidth="2" fill="none" opacity="0.4" />
      </svg>
      <div className="symbol-line" />
    </div>
  );
}

export default function SquidGame() {
  // ─── State ────────────────────────────────────────────────────────────
  const [gameState, setGameState] = useState<'landing' | 'playing' | 'over'>('landing');
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [imageTransitioning, setImageTransitioning] = useState(false);
  const [isDangerMode, setIsDangerMode] = useState(false);
  const [showEscOverlay, setShowEscOverlay] = useState(false);
  const [warningText, setWarningText] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showGlitchFlash, setShowGlitchFlash] = useState(false);

  // ─── Refs ─────────────────────────────────────────────────────────────
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const imageTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const escTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);

  // ─── Fullscreen handler ───────────────────────────────────────────────
  const handleFullscreenChange = useCallback(() => {
    if (!document.fullscreenElement && isPlayingRef.current) {
      setShowEscOverlay(true);
      if (escTimeoutRef.current) clearTimeout(escTimeoutRef.current);
      escTimeoutRef.current = setTimeout(() => {
        setShowEscOverlay(false);
      }, 3000);
    }
  }, []);

  // ─── Enter game ─────────────────────────────────────────────────────
  const enterGame = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // ignore if fullscreen fails
    }
    setGameState('playing');
    isPlayingRef.current = true;
  }, []);

  // ─── Image rotation ──────────────────────────────────────────────────
  const rotateImage = useCallback(() => {
    setNextImageIndex(prev => {
      const next = (prev + 1) % IMAGES.length;
      return next;
    });
    setImageTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(prev => (prev + 1) % IMAGES.length);
      setImageTransitioning(false);
    }, 1500);
  }, []);

  // ─── Trigger warning ─────────────────────────────────────────────────
  const triggerWarning = useCallback(() => {
    const msg = WARNING_MESSAGES[Math.floor(Math.random() * WARNING_MESSAGES.length)];
    setWarningText(msg);
    setShowWarning(true);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    warningTimerRef.current = setTimeout(() => setShowWarning(false), 1200);
  }, []);

  // ─── Trigger screen shake ────────────────────────────────────────────
  const triggerShake = useCallback(() => {
    setIsShaking(true);
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    shakeTimerRef.current = setTimeout(() => setIsShaking(false), 500);
  }, []);

  // ─── Trigger glitch flash ────────────────────────────────────────────
  const triggerGlitchFlash = useCallback(() => {
    setShowGlitchFlash(true);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    glitchTimerRef.current = setTimeout(() => setShowGlitchFlash(false), 350);
  }, []);

  // ─── Main timer effect ───────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Countdown
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameState('over');
          isPlayingRef.current = false;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Image rotation
    imageTimerRef.current = setInterval(() => {
      rotateImage();
    }, IMAGE_INTERVAL * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (imageTimerRef.current) clearInterval(imageTimerRef.current);
    };
  }, [gameState, rotateImage]);

  // ─── Danger mode effect ──────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'playing') return;
    const danger = timeLeft <= DANGER_THRESHOLD;
    setIsDangerMode(danger);
  }, [timeLeft, gameState]);

  // ─── Random effects during danger mode ────────────────────────────────
  useEffect(() => {
    if (!isDangerMode || gameState !== 'playing') return;

    const warnInterval = setInterval(() => {
      if (Math.random() < 0.5) triggerWarning();
    }, 8000);

    const shakeInterval = setInterval(() => {
      if (Math.random() < 0.35) triggerShake();
    }, 5000);

    return () => {
      clearInterval(warnInterval);
      clearInterval(shakeInterval);
    };
  }, [isDangerMode, gameState, triggerWarning, triggerShake]);

  // ─── Random glitch flashes (every few minutes, any mode) ──────────────
  useEffect(() => {
    if (gameState !== 'playing') return;
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.4) triggerGlitchFlash();
    }, isDangerMode ? 15000 : 45000);
    return () => clearInterval(glitchInterval);
  }, [gameState, isDangerMode, triggerGlitchFlash]);

  // ─── Fullscreen listener ─────────────────────────────────────────────
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFullscreenChange]);

  // ─── Game over fullscreen exit ─────────────────────────────────────
  useEffect(() => {
    if (gameState === 'over') {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, [gameState]);

  // ─── Computed values ─────────────────────────────────────────────────
  const progressPercent = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;
  const imageNum = currentImageIndex + 1;

  // ─── Render ──────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Grain overlay ── */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* ── Vignette ── */}
      <div className="vignette" aria-hidden="true" />

      {/* ── Background layers ── */}
      {IMAGES.map((img, i) => (
        <div
          key={img}
          className={`bg-layer ${i === currentImageIndex && !imageTransitioning ? 'active' : i === nextImageIndex && imageTransitioning ? 'active' : i === currentImageIndex ? 'active' : 'inactive'}`}
          style={{ backgroundImage: `url('/${img}')` }}
          aria-hidden="true"
        />
      ))}
      <div className="bg-darken" aria-hidden="true" />

      {/* ── Danger overlay ── */}
      <div className={`danger-overlay${isDangerMode && gameState === 'playing' ? ' active' : ''}`} aria-hidden="true" />

      {/* ── Glitch flash ── */}
      {showGlitchFlash && <div className="glitch-flash" aria-hidden="true" />}

      {/* ════════════════════════════════════════
          LANDING SCENE
      ════════════════════════════════════════ */}
      <main
        className={`landing-container${gameState !== 'landing' ? ' hidden' : ''}`}
        aria-hidden={gameState !== 'landing'}
      >
        <SquidShapes />

        <p className="landing-selected">YOU HAVE BEEN SELECTED.</p>

        <h1 className="landing-title">SQUID GAME</h1>
        <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)', fontWeight: 700, letterSpacing: '0.3em', color: '#FF2E63', marginTop: '-1rem', textShadow: '0 0 20px rgba(255,46,99,0.5)' }}>
          CTF
        </h2>

        <p className="landing-sub">
          Survive 2 hours.<br />
          Solve or be eliminated.
        </p>

        <button
          id="enter-game-btn"
          className="enter-btn"
          onClick={enterGame}
          aria-label="Enter the game"
        >
          ENTER THE GAME
        </button>
      </main>

      {/* ════════════════════════════════════════
          GAME SCREEN
      ════════════════════════════════════════ */}
      <section
        className={`game-screen${gameState !== 'playing' ? ' hidden' : ''}${isShaking ? ' shake' : ''}`}
        aria-label="Game timer screen"
        aria-hidden={gameState !== 'playing'}
      >
        {/* HUD Top */}
        <nav className="hud-bar">
          <div className="player-id" aria-label="Player ID">{PLAYER_ID}</div>
          <div className="image-progress" aria-label="Image progress">
            IMAGE {imageNum} / {IMAGES.length}
          </div>
        </nav>

        {/* Center Timer */}
        <div className="timer-wrapper">
          <div className="timer-label">TIME REMAINING</div>
          <div
            className={`timer${isDangerMode ? ' danger' : ''}`}
            aria-live="polite"
            aria-label={`Time remaining: ${formatTime(timeLeft)}`}
            role="timer"
          >
            {formatTime(timeLeft)}
          </div>
          <div className="timer-label" style={{ marginTop: '0.25rem' }}>
            {isDangerMode
              ? '⚠ DANGER ZONE — MOVE NOW'
              : timeLeft <= 1800
              ? '⚡ HALF TIME PASSED'
              : 'COMPETE. SURVIVE. WIN.'}
          </div>
        </div>

        {/* Bottom HUD */}
        <div className="bottom-hud">
          <div className={`status-pill${isDangerMode ? ' danger-pill' : ''}`}>
            {isDangerMode ? '⚠ CRITICAL — FINAL MINUTES' : '● LIVE CTF IN PROGRESS'}
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="time-progress-bar"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </section>

      {/* ── Warning flash text ── */}
      {showWarning && gameState === 'playing' && (
        <div className="warning-text" role="alert" aria-live="assertive">
          {warningText}
        </div>
      )}

      {/* ── ESC Overlay ── */}
      <div
        className={`esc-overlay${showEscOverlay ? ' visible' : ''}`}
        role="alertdialog"
        aria-label="Cannot escape message"
        aria-hidden={!showEscOverlay}
      >
        <p className="esc-message">YOU CANNOT<br />ESCAPE THE GAME.</p>
      </div>

      {/* ════════════════════════════════════════
          GAME OVER SCREEN
      ════════════════════════════════════════ */}
      <div
        className={`game-over-screen${gameState === 'over' ? ' active' : ''}`}
        role="dialog"
        aria-label="Game over — eliminated"
        aria-hidden={gameState !== 'over'}
      >
        <div className="eliminated-text" aria-label="Eliminated">ELIMINATED</div>
        <p className="eliminated-sub">PLAYER 067 · TIME HAS EXPIRED · GAME OVER</p>
      </div>
    </>
  );
}
