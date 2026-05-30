import { useParams } from "react-router-dom";

import PageLayout from "../components/layout/PageLayout";
import TournamentHeader from "../components/tournaments/TournamentHeader";
import TournamentRegistrationButton from "../components/tournaments/TournamentRegistrationButton";
import TournamentPlayerList from "../components/tournaments/TournamentPlayerList";

function TournamentDetails() {
  const { tournamentId } = useParams();

  return (
    <PageLayout>
      <section>
        <TournamentHeader tournamentId={tournamentId} />

        <TournamentRegistrationButton tournamentId={tournamentId} />

        <TournamentPlayerList tournamentId={tournamentId} />
      </section>
    </PageLayout>
  );
}

export default TournamentDetails;
