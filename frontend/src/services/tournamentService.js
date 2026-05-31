const API_URL = import.meta.env.VITE_API_URL;
import { authHeader } from "../utils/auth";

export async function getTournaments() {
  const response = await fetch(`${API_URL}/api/tournaments`, {
    headers: {
      ...authHeader(),
    },
  });

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

  let result;

  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    throw new Error(result.message || result.error || "Could not load rounds");
  }

  return result.data || [];
}

//added the ...authHeader() to protect the routes for only admins
export async function generateNextRound(tournamentId) {
  const response = await fetch(
    `${API_URL}/api/tournaments/${tournamentId}/rounds`,
    {
      method: "POST",
      headers: {
        ...authHeader(),
      },
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
      ...authHeader(),
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

export async function deleteTournament(tournamentId) {
  const response = await fetch(
    `${API_URL}/api/admin/tournament/${tournamentId}`,
    {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Could not delete tournament"
    );
  }

  return data;
}
