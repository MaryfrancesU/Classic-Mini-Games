import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./MergeBlock2048.scss";

const GRID_SIZE = 4;
const SWIPE_THRESHOLD = 40;

const getEmptyGrid = () => Array(GRID_SIZE * GRID_SIZE).fill(0);
const getRandomTile = () => (Math.random() < 0.9 ? 2 : 4);

const addRandomTile = (grid) => {
  const emptyIndexes = grid
    .map((v, i) => (v === 0 ? i : null))
    .filter((v) => v !== null);

  if (!emptyIndexes.length) return grid;

  const index = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  const newGrid = [...grid];
  newGrid[index] = getRandomTile();
  return newGrid;
};

const slideRow = (row) => {
  const nonZero = row.filter((v) => v !== 0);
  const result = [];

  for (let i = 0; i < nonZero.length; i++) {
    if (nonZero[i] === nonZero[i + 1]) {
      result.push(nonZero[i] * 2);
      i++;
    } else {
      result.push(nonZero[i]);
    }
  }

  while (result.length < GRID_SIZE) result.push(0);
  return result;
};

const getRows = (grid) =>
  Array.from({ length: GRID_SIZE }, (_, i) =>
    grid.slice(i * GRID_SIZE, i * GRID_SIZE + GRID_SIZE)
  );

const getCols = (grid) =>
  Array.from({ length: GRID_SIZE }, (_, i) =>
    grid.filter((_, idx) => idx % GRID_SIZE === i)
  );

const setRows = (rows) => rows.flat();

const setCols = (cols) => {
  const grid = getEmptyGrid();
  cols.forEach((col, c) =>
    col.forEach((val, r) => {
      grid[r * GRID_SIZE + c] = val;
    })
  );
  return grid;
};

const move = (grid, direction) => {
  if (direction === "left") return setRows(getRows(grid).map(slideRow));

  if (direction === "right")
    return setRows(
      getRows(grid).map((row) => slideRow([...row].reverse()).reverse())
    );

  if (direction === "up") return setCols(getCols(grid).map(slideRow));

  if (direction === "down")
    return setCols(
      getCols(grid).map((col) => slideRow([...col].reverse()).reverse())
    );

  return grid;
};

const hasMoves = (grid) => {
  if (grid.includes(0)) return true;

  for (let i = 0; i < grid.length; i++) {
    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;

    if (col < GRID_SIZE - 1 && grid[i] === grid[i + 1]) return true;
    if (row < GRID_SIZE - 1 && grid[i] === grid[i + GRID_SIZE]) return true;
  }

  return false;
};

const isMobile = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;

const MergeBlocks2048 = () => {
  const [grid, setGrid] = useState(getEmptyGrid());
  const [gameOver, setGameOver] = useState(false);
  const touchStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let start = addRandomTile(getEmptyGrid());
    start = addRandomTile(start);
    setGrid(start);
  }, []);

  const applyMove = (direction) => {
    if (gameOver) return;

    const newGrid = move(grid, direction);
    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      const updated = addRandomTile(newGrid);
      setGrid(updated);
      if (!hasMoves(updated)) setGameOver(true);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      const directions = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      };

      if (directions[e.key]) {
        e.preventDefault();
        applyMove(directions[e.key]);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid, gameOver]);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;

    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD)
      return;

    if (Math.abs(dx) > Math.abs(dy)) {
      applyMove(dx > 0 ? "right" : "left");
    } else {
      applyMove(dy > 0 ? "down" : "up");
    }
  };

  const resetGame = () => {
    let start = addRandomTile(getEmptyGrid());
    start = addRandomTile(start);
    setGrid(start);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <h2>
        {isMobile()
          ? "Swipe in any direction to play"
          : "Use your arrow keys to play"}
      </h2>

      <div
        className="grid"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {grid.map((value, index) => (
          <div key={index} className={`tile tile-${value}`}>
            {value !== 0 && value}
          </div>
        ))}

        {gameOver && (
          <div className="overlay">
            <h1>Game Over</h1>
            <div className="overlay-buttons">
              <button className="button" onClick={resetGame}>
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

export default MergeBlocks2048;
