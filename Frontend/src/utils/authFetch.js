// src/utils/authFetch.js
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export default async function authFetch(path, opts = {}) {
  const token = localStorage.getItem('token') || null;
  const headers = { ...(opts.headers || {}) };
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  return res;
}
