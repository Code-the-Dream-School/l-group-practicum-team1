export function saveAuthData(data) {
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem("token"));
}

export function logout() {
  localStorage.removeItem("token");
}
