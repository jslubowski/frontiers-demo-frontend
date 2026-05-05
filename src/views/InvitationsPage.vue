<script setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Message from 'primevue/message';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

import { useReviewersStore } from '@/stores/reviewers';
import { useUsersStore } from '@/stores/users';
import InviteReviewerDialog from '@/components/reviewers/modals/InviteReviewerDialog.vue';

const router = useRouter();
const reviewersStore = useReviewersStore();
const usersStore = useUsersStore();

const { invitations, loadingList, listError } = storeToRefs(reviewersStore);

const inviteDialog = ref(null);

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFormatter.format(d);
};

const userNameFor = (userId) => usersStore.getById(userId)?.userName ?? `User #${userId}`;

const rows = computed(() =>
  invitations.value.map((inv) => ({
    ...inv,
    userName: userNameFor(inv.userId),
    invitedAtFormatted: formatDate(inv.invitedAt),
  })),
);

const openRow = (event) => {
  router.push({ name: 'invitation-detail', params: { id: event.data.id } });
};

onMounted(() => {
  reviewersStore.fetchList();
  if (usersStore.items.length === 0) usersStore.fetchList();
});
</script>

<template>
  <section>
    <header class="page-header">
      <h1>Reviewer invitations</h1>
      <Button icon="pi pi-plus" label="Invite reviewer" @click="inviteDialog?.open()" />
    </header>

    <Message v-if="listError" severity="error" :closable="false">{{ listError }}</Message>

    <DataTable
      :value="rows"
      :loading="loadingList"
      data-key="id"
      striped-rows
      removable-sort
      show-gridlines
      selection-mode="single"
      @row-click="openRow"
    >
      <Column field="id" header="ID" :sortable="true" style="width: 5rem" />
      <Column field="userName" header="Invited user" :sortable="true">
        <template #body="{ data }">
          <div class="user-cell">
            <span>{{ data.userName }}</span>
            <Tag :value="`#${data.userId}`" severity="secondary" />
          </div>
        </template>
      </Column>
      <Column field="invitedAtFormatted" header="Invited at" :sortable="true" />
      <template #empty>
        <div class="empty">
          <i class="pi pi-inbox empty-icon" />
          <p>No invitations yet.</p>
          <Button label="Invite first reviewer" icon="pi pi-envelope" size="small" @click="inviteDialog?.open()" />
        </div>
      </template>
    </DataTable>

    <InviteReviewerDialog ref="inviteDialog" />
  </section>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  margin: 0;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1.5rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 2.5rem;
  opacity: 0.4;
}

.empty p {
  margin: 0;
  font-size: 0.95rem;
}

:deep(.p-datatable-tbody > tr) {
  cursor: pointer;
}
</style>
