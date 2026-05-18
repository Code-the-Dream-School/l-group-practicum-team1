import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tournaments from "./pages/Tournaments";
import TournamentDetails from "./pages/TournamentDetails";
import CreateTournament from "./pages/CreateTournament";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournaments/:id" element={<TournamentDetails />} />
        <Route path="/tournaments/create" element={<CreateTournament />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
