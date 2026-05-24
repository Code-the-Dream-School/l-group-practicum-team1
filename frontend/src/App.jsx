import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TournamentDetails from "./pages/TournamentDetails";
import CreateTournament from "./pages/CreateTournament";
import AddPlayers from "./pages/AddPlayers";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/tournaments/:tournamentId"
        element={<TournamentDetails />}
      />
      <Route path="/tournaments/:id/players" element={<AddPlayers />} />
      <Route path="/tournaments/create" element={<CreateTournament />} />
    </Routes>
  );
}

export default App;
