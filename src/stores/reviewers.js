import { defineStore } from 'pinia';

import * as api from '@/api/reviewers';
import { generalErrorMessage } from '@/api/errors';

export const useReviewersStore = defineStore('reviewers', {
  state: () => ({
    invitations: [],
    byId: {},
    loadingList: false,
    loadingDetail: false,
    inviting: false,
    listError: null,
    detailError: null,
    inviteError: null,
  }),
  getters: {
    getById: (state) => (id) => state.byId[Number(id)] ?? null,
  },
  actions: {
    async fetchList() {
      this.loadingList = true;
      this.listError = null;
      try {
        const data = await api.listInvitations();
        this.invitations = data ?? [];
        for (const inv of this.invitations) this.byId[inv.id] = inv;
      } catch (err) {
        this.listError = generalErrorMessage(err);
      } finally {
        this.loadingList = false;
      }
    },
    async fetchById(id) {
      const numId = Number(id);
      this.loadingDetail = true;
      this.detailError = null;
      try {
        const inv = await api.getInvitation(numId);
        if (inv) this.byId[numId] = inv;
        return inv;
      } catch (err) {
        this.detailError = generalErrorMessage(err);
        return null;
      } finally {
        this.loadingDetail = false;
      }
    },
    async invite(userId) {
      this.inviting = true;
      this.inviteError = null;
      try {
        const result = await api.inviteReviewer(userId);
        if (result && result.isEligible === false) {
          this.inviteError = result.message ?? 'Reviewer is not eligible.';
          return false;
        }
        await this.fetchList();
        return true;
      } catch (err) {
        this.inviteError = generalErrorMessage(err);
        return false;
      } finally {
        this.inviting = false;
      }
    },
    clearInviteError() {
      this.inviteError = null;
    },
  },
});
