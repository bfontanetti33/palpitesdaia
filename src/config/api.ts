export const BASE_URL = "https://palpites-backend-production.up.railway.app";
export const PREMIUM_TOKEN = "Pp$9xK#mR2@vLqZ7!nWd";

export const apiUrl = (path: string) =>
  `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const authHeaders = (): HeadersInit => ({
  Authorization: `Bearer ${PREMIUM_TOKEN}`,
});
