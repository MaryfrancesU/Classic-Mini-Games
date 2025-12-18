import GameEndOverlay from "../../shared/Overlay/GameEndOverlay";
import { useEffect, useRef, useState } from "react";
import "./WhackAMole.scss";

const GRID_SIZE = 9;
const GAME_TIME = 30;

const WhackAMole = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const moleTimer = useRef(null);
  const countdownTimer = useRef(null);

  useEffect(() => {
    if (!started) return;

    moleTimer.current = setInterval(() => {
      setActiveIndex(Math.floor(Math.random() * GRID_SIZE));
    }, 700);

    countdownTimer.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(moleTimer.current);
      clearInterval(countdownTimer.current);
    };
  }, [started]);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(moleTimer.current);
      clearInterval(countdownTimer.current);
      setGameOver(true);
      setStarted(false);
      setActiveIndex(null);
    }
  }, [timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setGameOver(false);
    setStarted(true);
  };

  const hitMole = (index) => {
    if (!started || index !== activeIndex) return;

    setScore((prev) => prev + 1);
    setActiveIndex(null);
  };

  return (
    <div className="whack-container">
      <h2>Whack A Mole! </h2>

      <button
        className="button"
        onClick={startGame}
        disabled={started || gameOver}
      >
        Start Game
      </button>

      <div className="hud">
        <span>Score: {score}</span>
        <span>Time: {timeLeft}s</span>
      </div>

      <div className="grid">
        {Array.from({ length: GRID_SIZE }).map((_, index) => (
          <button
            key={index}
            className={`hole ${activeIndex === index ? "active" : ""}`}
            onClick={() => hitMole(index)}
            disabled={!started}
          >
            {activeIndex === index && <div className="mole" />}
          </button>
        ))}

        {gameOver && (
          <GameEndOverlay title="Game Over" onRestart={startGame}>
            <p>Final Score: {score}</p>
          </GameEndOverlay>
        )}
      </div>
    </div>
  );
};

export default WhackAMole;
