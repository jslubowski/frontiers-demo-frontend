<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Message from 'primevue/message';

import { useUsersStore } from '@/stores/users';
import RegisterUserDialog from '@/components/users/modals/RegisterUserDialog.vue';

const router = useRouter();
const usersStore = useUsersStore();
const { items, loadingList, listError } = storeToRefs(usersStore);

const registerDialog = ref(null);

const openRow = (event) => {
  router.push({ name: 'user-detail', params: { id: event.data.id } });
};

onMounted(() => usersStore.fetchList());
</script>

<template>
  <section>
    <header class="page-header">
      <h1>Users</h1>
      <Button icon="pi pi-plus" label="Register user" @click="registerDialog?.open()" />
    </header>

    <Message v-if="listError" severity="error" :closable="false">{{ listError }}</Message>

    <DataTable
      :value="items"
      :loading="loadingList"
      data-key="id"
      striped-rows
      removable-sort
      show-gridlines
      selection-mode="single"
      @row-click="openRow"
    >
      <Column field="id" header="ID" :sortable="true" style="width: 5rem" />
      <Column field="userName" header="Name" :sortable="true" />
      <Column field="organizationName" header="University" :sortable="true" />
      <Column field="city" header="City" :sortable="true" />
      <Column field="country" header="Country" :sortable="true" />
      <Column
        field="numberOfPublications"
        header="Publications"
        :sortable="true"
        style="width: 9rem"
      />
      <template #empty>
        <div class="empty">
          <i class="pi pi-inbox empty-icon" />
          <p>No users yet.</p>
          <Button label="Register first user" icon="pi pi-plus" size="small" @click="registerDialog?.open()" />
        </div>
      </template>
    </DataTable>

    <RegisterUserDialog ref="registerDialog" />
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
