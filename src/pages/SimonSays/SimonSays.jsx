import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./SimonSays.scss";

const COLORS = ["green", "red", "yellow", "blue"];

const TONES = {
  green: 329.63,
  red: 261.63, 
  yellow: 392.0,
  blue: 440.0,
};

const SimonSays = () => {
  const [sequence, setSequence] = useState([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [activeColor, setActiveColor] = useState(null);
  const [acceptingInput, setAcceptingInput] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const audioCtxRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    audioCtxRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();

    return () => {
      clearTimeout(timeoutRef.current);
      audioCtxRef.current?.close();
    };
  }, []);

  const playTone = (color, duration = 300) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = TONES[color];
    osc.type = "sine";

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + duration / 1000
    );

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  };

  const startGame = () => {
    setSequence([]);
    setPlayerIndex(0);
    setGameOver(false);
    setStarted(true);
    startCountdown();
  };

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);

    const tick = () => {
      count -= 1;

      if (count === 0) {
        setCountdown(null);
        nextRound([]);
        return;
      }

      setCountdown(count);
      timeoutRef.current = setTimeout(tick, 800);
    };

    timeoutRef.current = setTimeout(tick, 800);
  };

  const nextRound = (prev) => {
    const next = [...prev, COLORS[Math.floor(Math.random() * COLORS.length)]];
    setSequence(next);
    playSequence(next);
  };

  const playSequence = async (seq) => {
    setAcceptingInput(false);

    for (let i = 0; i < seq.length; i++) {
      await flash(seq[i]);
    }

    setPlayerIndex(0);
    setAcceptingInput(true);
  };

  const flash = (color) => {
    return new Promise((resolve) => {
      setActiveColor(color);
      playTone(color);

      timeoutRef.current = setTimeout(() => {
        setActiveColor(null);
        setTimeout(resolve, 250);
      }, 500);
    });
  };

  const handleClick = async (color) => {
    if (!acceptingInput || gameOver) return;

    playTone(color);

    if (color !== sequence[playerIndex]) {
      setGameOver(true);
      setAcceptingInput(false);
      return;
    }

    await flash(color);

    if (playerIndex + 1 === sequence.length) {
      nextRound(sequence);
    } else {
      setPlayerIndex(playerIndex + 1);
    }
  };

  return (
    <div className="simon-container">
      <h2>Simon Says</h2>

      {!started && (
        <button className="button start-button" onClick={startGame}>
          Start Game
        </button>
      )}

      {started && (
        <p className="instructions">
          Repeat the growing pattern for as long as you can!
        </p>
      )}

      <div className="board">
        {COLORS.map((color) => (
          <button
            key={color}
            className={`pad ${color} ${activeColor === color ? "active" : ""}`}
            onClick={() => handleClick(color)}
            disabled={!acceptingInput}
          />
        ))}

        {countdown !== null && (
          <div className="overlay">
            <h1>{countdown}</h1>
          </div>
        )}

        {gameOver && (
          <div className="overlay">
            <h1>Game Over</h1>
            <div className="overlay-buttons">
              <button className="button" onClick={startGame}>
                Play Again
              </button>
              <Link to="/" className="button">
                Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimonSays;
