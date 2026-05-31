export function saveAuthData(data) {
  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
}

export function getCurrentUser() {
  const user = localStorage.getItem("user");
  if (!user) return null;
  return JSON.parse(user);
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem("token"));
}

export function isAdmin() {
  const user = getCurrentUser();
  return user?.role === "ADMIN";
}

export function authHeader() {
  const token = localStorage.getItem("token");
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
