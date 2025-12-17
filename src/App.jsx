import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import NavBar from "./shared/NavBar/NavBar";
import Home from './pages/Home/Home';
import HangMan from './pages/HangMan/HangMan';
import TicTacToe from './pages/TicTacToe/TicTacToe';
import SimonSays from './pages/SimonSays/SimonSays';
import WhackAMole from './pages/WhackAMole/WhackAMole';
import MergeBlock2048 from './pages/MergeBlock2048/MergeBlock2048';

function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename="/Classic-Mini-Games">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/hang-man" element={<HangMan />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/simon-says" element={<SimonSays />} />
          <Route path="/whack-a-mole" element={<WhackAMole />} />
          <Route path="/2048" element={<MergeBlock2048 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
