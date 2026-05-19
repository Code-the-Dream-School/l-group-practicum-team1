import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import TournamentDetails from "./pages/TournamentDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/tournaments/:tournamentId"
        element={<TournamentDetails />}
      />
    </Routes>
  );
}

export default App;
