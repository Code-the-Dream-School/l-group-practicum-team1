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
