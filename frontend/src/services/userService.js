const API_URL = import.meta.env.VITE_API_URL;

import { authHeader } from "../utils/auth";

export async function getMyProfile() {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      ...authHeader(),
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    console.log("Profile error:", response.status, data);
    throw new Error(data.message || "Could not load profile");
  }

  return data.user;
}

export async function updateMyProfile(profileData) {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(profileData),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    console.log("Update profile error:", response.status, data);
    throw new Error(data.message || "Could not update profile");
  }

  return data.user;
}
