import { apiFetch } from './client';

export function listInvitations() {
  return apiFetch('/reviewers/invitations');
}

export function getInvitation(id) {
  return apiFetch(`/reviewers/invitations/${id}`);
}

export function inviteReviewer(userId) {
  return apiFetch('/reviewers/invite', { method: 'POST', body: { userId } });
}
