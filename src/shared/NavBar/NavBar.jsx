import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <button className="icon-button menu-button" onClick={() => setOpen(true)}>
          ☰
        </button>
        <h1 className="title">Classic Mini Games</h1>
      </nav>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <div className={`drawer ${open ? "open" : ""}`}>
        <button className="icon-button close-button" onClick={() => setOpen(false)}>
          ✕
        </button>

        <ul className="drawer-links">
          <li>
            <Link to="/hang-man" onClick={() => setOpen(false)}>
              Hang Man
            </Link>
          </li>
          <li>
            <Link to="/tic-tac-toe" onClick={() => setOpen(false)}>
              Tic Tac Toe
            </Link>
          </li>
          <li>
            <Link to="/simon-says" onClick={() => setOpen(false)}>
              Simon Says
            </Link>
          </li>
          <li>
            <Link to="/whack-a-mole" onClick={() => setOpen(false)}>
              Whack A Mole
            </Link>
          </li>
          <li>
            <Link to="/2048" onClick={() => setOpen(false)}>
              2048
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
