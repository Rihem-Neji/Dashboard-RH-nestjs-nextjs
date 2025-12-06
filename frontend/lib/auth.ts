import { jwtDecode} from "jwt-decode";

const TOKEN_KEY = "access_token";
const USER_KEY  = "auth_user"; // cache léger

export function saveToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);

  // on décode pour récupérer l’email/role et le mettre en cache
  try {
    const payload = jwtDecode<JwtPayload>(token);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({ id: payload.sub, email: payload.email, role: payload.role })
    );
  } catch {}
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = jwtDecode<{ exp?: number }>(token);
    if (payload?.exp && Date.now() >= payload.exp * 1000) {
      logout();
      return false;
    }
    return true;
  } catch {
    logout();
    return false;
  }
}
  export interface JwtPayload {
  sub: any;
  email?: string;
  role?: string;
  exp?: number;
}

export function getUser(): { id?: string; email?: string; role?: string } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }

}


