import { apiFetch } from './client';

export function listUsers() {
  return apiFetch('/users');
}

export function getUser(id) {
  return apiFetch(`/users/${id}`);
}

export function registerUser(payload) {
  return apiFetch('/users', { method: 'POST', body: payload });
}
