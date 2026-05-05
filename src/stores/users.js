import { defineStore } from 'pinia';

import * as api from '@/api/users';
import { fieldErrors, generalErrorMessage } from '@/api/errors';

export const useUsersStore = defineStore('users', {
  state: () => ({
    items: [],
    byId: {},
    loadingList: false,
    loadingDetail: false,
    submitting: false,
    listError: null,
    detailError: null,
    submitError: null,
    submitFieldErrors: {},
  }),
  getters: {
    getById: (state) => (id) => state.byId[Number(id)] ?? null,
  },
  actions: {
    async fetchList() {
      this.loadingList = true;
      this.listError = null;
      try {
        const data = await api.listUsers();
        this.items = data ?? [];
        for (const u of this.items) this.byId[u.id] = u;
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
        const user = await api.getUser(numId);
        if (user) this.byId[numId] = user;
        return user;
      } catch (err) {
        this.detailError = generalErrorMessage(err);
        return null;
      } finally {
        this.loadingDetail = false;
      }
    },
    async register(payload) {
      this.submitting = true;
      this.submitError = null;
      this.submitFieldErrors = {};
      try {
        await api.registerUser(payload);
        await this.fetchList();
        return true;
      } catch (err) {
        this.submitFieldErrors = fieldErrors(err);
        const hasFieldErrors = Object.keys(this.submitFieldErrors).length > 0;
        this.submitError = hasFieldErrors ? null : generalErrorMessage(err);
        return false;
      } finally {
        this.submitting = false;
      }
    },
    clearSubmitError() {
      this.submitError = null;
      this.submitFieldErrors = {};
    },
  },
});
