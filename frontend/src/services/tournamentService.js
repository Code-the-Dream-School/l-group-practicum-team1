const API_URL = import.meta.env.VITE_API_URL;

export async function getTournaments() {
  const response = await fetch(`${API_URL}/api/tournaments`);

  let result;

  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    throw new Error(result.message || "Could not load tournaments");
  }

  return result.data || [];
}

export async function getRounds(tournamentId) {
  const response = await fetch(
    `${API_URL}/api/tournaments/${tournamentId}/rounds`
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = [];
  }

  if (!response.ok) {
    throw new Error(data.message || "Could not load rounds");
  }

  return data;
}

export async function generateNextRound(tournamentId) {
  const response = await fetch(
    `${API_URL}/api/tournaments/${tournamentId}/rounds`,
    {
      method: "POST",
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Could not generate next round");
  }

  return data;
}

export async function updateMatch(matchId, matchData) {
  const response = await fetch(`${API_URL}/api/matches/${matchId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(matchData),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Could not update match");
  }

  return data;
}
