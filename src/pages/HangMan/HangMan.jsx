import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Hangman.scss";

import hangman0 from "../../images/hangman/hangman_0.png";
import hangman1 from "../../images/hangman/hangman_1.png";
import hangman2 from "../../images/hangman/hangman_2.png";
import hangman3 from "../../images/hangman/hangman_3.png";
import hangman4 from "../../images/hangman/hangman_4.png";
import hangman5 from "../../images/hangman/hangman_5.png";
import hangman6 from "../../images/hangman/hangman_7.png"; //decided to skip 6

const images = [
  hangman0,
  hangman1,
  hangman2,
  hangman3,
  hangman4,
  hangman5,
  hangman6,
];

const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const MAX_WRONG_GUESSES = 6;

const Hangman = () => {
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [win, setWin] = useState(false);

  useEffect(() => {
    fetchWord();
  }, []);

  useEffect(() => {
    if (loading || !word) return;

    const isWin = word
      .split("")
      .every((letter) => guessedLetters.includes(letter));

    if (isWin) {
      setWin(true);
      setGameOver(true);
    }

    if (wrongGuesses >= MAX_WRONG_GUESSES) {
      setGameOver(true);
    }
  }, [guessedLetters, wrongGuesses, word, loading]);

  const fetchWord = async () => {
    setLoading(true);

    try {
      const res = await fetch("https://www.wordgamedb.com/api/v1/words/random");
      const data = await res.json();
      setWord(data.word.toUpperCase());
    } catch {
      setWord("REACT");
    } finally {
      setLoading(false);
    }
  };

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || gameOver || loading) return;

    setGuessedLetters((prev) => [...prev, letter]);

    if (!word.includes(letter)) {
      setWrongGuesses((prev) => prev + 1);
    }
  };

  const resetGame = () => {
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameOver(false);
    setWin(false);
    fetchWord();
  };

  const renderWord = () => {
    return word.split("").map((letter, idx) => {
      const isGuessed = guessedLetters.includes(letter);
      const revealOnLoss = gameOver && !win;

      return (
        <span
          key={idx}
          className={`letter ${isGuessed ? "correct" : ""} ${
            revealOnLoss ? "wrong" : ""
          }`}
        >
          {isGuessed || revealOnLoss ? letter : "_"}
        </span>
      );
    });
  };

  return (
    <div className="hangman-container">
      <img
        className="hangman-image"
        src={images[loading ? 0 : gameOver && !win ? 6 : wrongGuesses]}
        alt="Hangman"
      />

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="word">{renderWord()}</div>

          <div className="keyboard">
            {keyboardRows.map((row, i) => (
              <div key={i} className="keyboard-row">
                {row.map((letter) => {
                  const isGuessed = guessedLetters.includes(letter);
                  const isCorrect = word.includes(letter);

                  return (
                    <button
                      key={letter}
                      disabled={isGuessed || gameOver}
                      className={`key ${
                        isGuessed ? (isCorrect ? "correct" : "wrong") : ""
                      }`}
                      onClick={() => handleGuess(letter)}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}

      {gameOver && !loading && (
        <div className="overlay">
          <h1>{win ? "You Win!" : "Game Over"}</h1>
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
  );
};

export default Hangman;
