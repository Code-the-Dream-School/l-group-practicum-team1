import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TournamentDetails from "./pages/TournamentDetails";
import CreateTournament from "./pages/CreateTournament";
import AddPlayers from "./pages/AddPlayers";
import RoundResults from "./pages/RoundResults";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/tournaments/:tournamentId"
        element={<TournamentDetails />}
      />
      <Route
        path="/tournaments/:tournamentId/players"
        element={<AddPlayers />}
      />
      <Route
        path="/tournaments/:tournamentId/rounds"
        element={<RoundResults />}
      />

      <Route path="/tournaments/create" element={<CreateTournament />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
