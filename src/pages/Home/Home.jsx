import "./Home.scss";
import { games } from "./games.data";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

export default function Home() {
  const [flippedIndex, setFlippedIndex] = useState(null);
  const flipBackTimeout = useRef(null);

  const handleClick = (index) => {
    setFlippedIndex((prev) => (prev === index ? null : index));
  };

  const handleMouseLeave = () => {
    flipBackTimeout.current = setTimeout(() => {
      setFlippedIndex(null);
    }, 600);
  };

  const handleMouseEnter = () => {
    if (flipBackTimeout.current) {
      clearTimeout(flipBackTimeout.current);
    }
  };

  return (
    <div className="home">
      <h2 className="title">Choose a Game, Any Game! </h2>

      <div className="grid">
        {games.map((game, index) => (
          <div key={game.title} className="tile-wrapper">
            <div
              className={`tile ${
                flippedIndex === index ? "tile--flipped" : ""
              }`}
              onClick={() => handleClick(index)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="tile__face tile__face--front">
                <img src={game.image} alt={game.title} />
                <h3>{game.title}</h3>
              </div>

              <div className="tile__face tile__face--back">
                <p>{game.description}</p>
                <Link to={game.path} className="play-button">
                  PLAY
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
