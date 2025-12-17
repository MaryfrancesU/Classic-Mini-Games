import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MergeBlock2048.scss";

const GRID_SIZE = 4;

const getEmptyGrid = () => Array(GRID_SIZE * GRID_SIZE).fill(0);

const getRandomTile = () => (Math.random() < 0.9 ? 2 : 4);

const addRandomTile = (grid) => {
  const emptyIndexes = grid
    .map((v, i) => (v === 0 ? i : null))
    .filter((v) => v !== null);

  if (emptyIndexes.length === 0) return grid;

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
  let newGrid = grid;

  if (direction === "left") {
    newGrid = setRows(getRows(grid).map(slideRow));
  }

  if (direction === "right") {
    newGrid = setRows(
      getRows(grid).map((row) => slideRow([...row].reverse()).reverse())
    );
  }

  if (direction === "up") {
    newGrid = setCols(getCols(grid).map(slideRow));
  }

  if (direction === "down") {
    newGrid = setCols(
      getCols(grid).map((col) => slideRow([...col].reverse()).reverse())
    );
  }

  return newGrid;
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

const MergeBlocks2048 = () => {
  const [grid, setGrid] = useState(getEmptyGrid());
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let start = addRandomTile(getEmptyGrid());
    start = addRandomTile(start);
    setGrid(start);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;

      const directions = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      };

      if (!(e.key in directions)) return;

      const newGrid = move(grid, directions[e.key]);

      if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
        const updated = addRandomTile(newGrid);
        setGrid(updated);

        if (!hasMoves(updated)) setGameOver(true);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid, gameOver]);

  const resetGame = () => {
    let start = addRandomTile(getEmptyGrid());
    start = addRandomTile(start);
    setGrid(start);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <h2>Use your arrow keys to play!</h2>

      <div className="grid">
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
