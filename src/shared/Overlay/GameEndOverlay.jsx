import { Link } from "react-router-dom";
import "./GameEndOverlay.scss";

const GameEndOverlay = ({ title, onRestart, children = null }) => {
  return (
    <div className="overlay">
      <h1>{title}</h1>

      {children}

      <div className="overlay-buttons">
        <button className="button" onClick={onRestart}>
          Play Again
        </button>
        <Link to="/" className="button">
          Home
        </Link>
      </div>
    </div>
  );
};

export default GameEndOverlay;
