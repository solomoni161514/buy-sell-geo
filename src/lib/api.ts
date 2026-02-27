export const API_BASE = (import.meta.env.VITE_API_URL as string) || '';

export function apiUrl(path: string) {
  // allow passing full URLs directly
  if (/^https?:\/\//i.test(path)) return path;
  if (!path.startsWith('/')) path = '/' + path;
  const base = API_BASE.replace(/\/$/, '');
  return (base || '') + path;
}

export function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), init);
}

export default apiFetch;
