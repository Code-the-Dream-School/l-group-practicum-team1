import Header from "../components/layout/Header";
import { useParams } from "react-router-dom";

function TournamentDetails() {
  const { tournamentId } = useParams();

  return (
    <main>
      <Header loggedIn={false} />

      <h1>Tournament Details</h1>

      <p>{tournamentId}</p>
    </main>
  );
}

export default TournamentDetails;
