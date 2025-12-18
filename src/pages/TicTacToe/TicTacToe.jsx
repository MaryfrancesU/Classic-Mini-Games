import GameEndOverlay from "../../shared/Overlay/GameEndOverlay";
import { useState, useEffect } from "react";
import "./TicTacToe.scss";

const PLAYER = "X";
const COMPUTER = "O";

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [difficulty, setDifficulty] = useState("hard");
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result);
    } else if (!board.includes(null)) {
      setIsDraw(true);
    } else if (!isPlayerTurn) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [board, isPlayerTurn]);

  const checkWinner = (board) => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (!isPlayerTurn || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = PLAYER;
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const minimax = (newBoard, player) => {
    const availableSpots = newBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((v) => v !== null);

    const win = checkWinner(newBoard);
    if (win === PLAYER) return { score: -10 };
    if (win === COMPUTER) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    const moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
      const move = {};
      move.index = availableSpots[i];
      newBoard[availableSpots[i]] = player;

      const result = minimax(newBoard, player === COMPUTER ? PLAYER : COMPUTER);
      move.score = result.score;

      newBoard[availableSpots[i]] = null;
      moves.push(move);
    }

    let bestMove;
    if (player === COMPUTER) {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  };

  const getAvailableMoves = (board) =>
    board
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((idx) => idx !== null);

  const getRandomMove = (board) => {
    const available = getAvailableMoves(board);
    return available[Math.floor(Math.random() * available.length)];
  };

  const makeComputerMove = () => {
    let move;

    if (difficulty === "easy") {
      move = getRandomMove(board);
    }

    if (difficulty === "medium") {
      move =
        Math.random() < 0.5
          ? minimax(board, COMPUTER).index
          : getRandomMove(board);
    }

    if (difficulty === "hard") {
      move = minimax(board, COMPUTER).index;
    }

    const newBoard = [...board];
    newBoard[move] = COMPUTER;
    setBoard(newBoard);
    setIsPlayerTurn(true);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setIsDraw(false);
  };

  return (
    <div className="container">
      <div className="legend">
        <h2>
          <span style={{ color: "red", fontWeight: "bold" }}>X</span> = Player
        </h2>
        <h2>
          <span style={{ color: "blue", fontWeight: "bold" }}>O</span> =
          Computer
        </h2>
      </div>

      <div className="difficulty">
        <label>Difficulty: </label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <h3 className="turn-indicator">
        {winner
          ? "Game Over"
          : isPlayerTurn
          ? "Player's Turn"
          : "Computer's Turn"}
      </h3>

      <div className="board-wrapper">
        <div className="board">
          {board.map((cell, index) => (
            <div
              key={index}
              className="cell"
              onClick={() => handleClick(index)}
            >
              {cell === PLAYER && <span className="mark player-mark">X</span>}
              {cell === COMPUTER && (
                <span className="mark computer-mark">O</span>
              )}
            </div>
          ))}
        </div>

        {(winner || isDraw) && (
          <GameEndOverlay
            title={
              winner === PLAYER
                ? "You Win!"
                : winner === COMPUTER
                ? "Computer Wins"
                : "It's a Draw"
            }
            onRestart={resetGame}
          />
        )}
      </div>
    </div>
  );
};

export default TicTacToe;
