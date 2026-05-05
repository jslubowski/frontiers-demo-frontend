<script setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import Message from 'primevue/message';

import { useReviewersStore } from '@/stores/reviewers';
import { useUsersStore } from '@/stores/users';

const toast = useToast();
const reviewersStore = useReviewersStore();
const usersStore = useUsersStore();

const { inviting, inviteError } = storeToRefs(reviewersStore);
const { items: users } = storeToRefs(usersStore);

const visible = ref(false);
const selectedUser = ref(null);

const userOptions = computed(() =>
  users.value.map((u) => ({
    label: `${u.userName} — ${u.organizationName} (${u.numberOfPublications} publications)`,
    value: u.id,
  })),
);

const open = () => {
  selectedUser.value = null;
  reviewersStore.clearInviteError();
  visible.value = true;
};

const submit = async () => {
  if (selectedUser.value == null) return;
  const ok = await reviewersStore.invite(selectedUser.value);
  if (ok) {
    visible.value = false;
    const name = users.value.find((u) => u.id === selectedUser.value)?.userName ?? 'User';
    toast.add({ severity: 'success', summary: 'Reviewer invited', detail: `${name} was invited`, life: 3000 });
  }
};

defineExpose({ open });
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Invite reviewer"
    :style="{ width: '30rem' }"
    :closable="!inviting"
  >
    <form class="form" @submit.prevent="submit">
      <label class="field">
        <span>Select user</span>
        <Select
          v-model="selectedUser"
          :options="userOptions"
          option-label="label"
          option-value="value"
          placeholder="Choose a user…"
          :disabled="inviting"
          filter
          filter-placeholder="Search…"
          :invalid="!!inviteError"
          class="w-full"
        />
      </label>

      <Message v-if="inviteError" severity="error" :closable="false">{{ inviteError }}</Message>

      <footer class="actions">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          :disabled="inviting"
          @click="visible = false"
        />
        <Button
          type="submit"
          label="Invite"
          icon="pi pi-envelope"
          :loading="inviting"
          :disabled="selectedUser == null"
        />
      </footer>
    </form>
  </Dialog>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field span {
  font-size: 0.85rem;
  color: #6b7280;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.w-full {
  width: 100%;
}
</style>
