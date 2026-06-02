export function getTournamentStatus(tournament) {
  const today = new Date();
  const startDate = new Date(tournament.startDate);
  const endDate = tournament.endDate ? new Date(tournament.endDate) : null;

  if (startDate > today) {
    return "upcoming";
  }

  if (endDate && endDate < today) {
    return "completed";
  }

  return "live";
}

export function formatTournamentDateRange(startDate, endDate) {
  const formattedStart = new Date(startDate).toLocaleDateString();

  if (!endDate) {
    return formattedStart;
  }

  const formattedEnd = new Date(endDate).toLocaleDateString();

  return `${formattedStart} - ${formattedEnd}`;
}

export function getMaxPlayers(totalRounds) {
  if (!totalRounds) return 0;

  return 2 ** totalRounds;
}

export function formatPlayerCapacity(registeredPlayers, totalRounds) {
  const maxPlayers = getMaxPlayers(totalRounds);

  return `${registeredPlayers}/${maxPlayers} Players`;
}

export function getTournamentResult(rounds) {
  if (!rounds.length) return null;

  const finalRound = [...rounds].sort(
    (a, b) => b.roundNumber - a.roundNumber,
  )[0];

  const finalMatch = finalRound.matches?.[0];

  if (!finalMatch?.winnerPlayerId) return null;

  const winner =
    finalMatch.winnerPlayerId === finalMatch.player1.id
      ? finalMatch.player1
      : finalMatch.player2;

  const runnerUp =
    finalMatch.player1?.id === winner.id
      ? finalMatch.player2
      : finalMatch.player1;

  return {
    winner,
    runnerUp,
    finalScore: `${finalMatch.player1Score == 0.5 ? "1/2" : finalMatch.player1Score} - ${finalMatch.player2Score == 0.5 ? "1/2" : finalMatch.player2Score}`,
  };
}
