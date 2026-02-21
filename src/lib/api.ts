export const API_BASE = (import.meta.env.VITE_API_BASE as string) || '';

export function apiUrl(path: string) {
  if (!path.startsWith('/')) path = '/' + path;
  const base = API_BASE.replace(/\/$/, '');
  return (base || '') + path;
}

export function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), init);
}

export default apiFetch;
