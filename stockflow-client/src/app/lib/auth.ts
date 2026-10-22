export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem("stockflow_token");
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function logout(): void {
  sessionStorage.removeItem("stockflow_token");
  window.location.replace("/login");
}
