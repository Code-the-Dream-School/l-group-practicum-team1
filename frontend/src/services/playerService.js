const API_URL = import.meta.env.VITE_API_URL;

import { authHeader } from "../utils/auth";

export async function getTournamentPlayers(tournamentId) {
  const response = await fetch(
    `${API_URL}/api/tournaments/${tournamentId}/players`,
    {
      headers: {
        ...authHeader(),
      },
    }
  );

  let result;

  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    throw new Error(result.message || "Could not load players");
  }

  return result.data || [];
}

export async function signUpForTournament(tournamentId, userId) {
  const response = await fetch(
    `${API_URL}/api/tournaments/${tournamentId}/players`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify({
        userId,
        status: "REGISTERED",
      }),
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Could not register for tournament");
  }

  return data;
}

export async function withdrawFromTournament(tournamentId, userId) {
  const response = await fetch(
    `${API_URL}/api/tournaments/${tournamentId}/players/${userId}`,
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
    throw new Error(data.message || "Could not withdraw from tournament");
  }

  return data;
}
