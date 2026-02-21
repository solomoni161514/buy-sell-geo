// Use empty base during development so Vite's /api proxy works.
// In production use VITE_API_URL (or VITE_API_BASE if set).
const PROD_BASE = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || '') as string;
export const API_BASE = import.meta.env.DEV ? '' : PROD_BASE;

export function apiUrl(path: string) {
  // allow passing full URLs directly
  if (/^https?:\/\//i.test(path)) return path;
  if (!path.startsWith('/')) path = '/' + path;
  const base = (API_BASE || '').replace(/\/$/, '');
  return (base || '') + path;
}

export function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), init);
}

export default apiFetch;
