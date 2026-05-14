import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TournamentsPage from "./pages/TournamentsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
