export async function login(email, password) {
  // TEMP: replace with backend API later
  if (email === "admin@ai.com" && password === "admin123") {
    localStorage.setItem("token", "mock-admin-token");
    return;
  }

  throw new Error("Invalid credentials");
}

export function logout() {
  localStorage.removeItem("token");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

