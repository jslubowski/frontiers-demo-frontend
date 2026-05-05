<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Menubar from 'primevue/menubar';

const route = useRoute();
const router = useRouter();

const items = computed(() => [
  {
    label: 'Users',
    icon: 'pi pi-users',
    class: route.path.startsWith('/users') ? 'shell-active' : '',
    command: () => router.push('/users'),
  },
  {
    label: 'Invitations',
    icon: 'pi pi-envelope',
    class: route.path.startsWith('/invitations') ? 'shell-active' : '',
    command: () => router.push('/invitations'),
  },
]);
</script>

<template>
  <Menubar :model="items" class="shell-bar">
    <template #start>
      <span class="shell-brand">Frontiers Demo</span>
    </template>
  </Menubar>
</template>

<style scoped>
.shell-bar {
  border-radius: 0;
  border-left: 0;
  border-right: 0;
  border-top: 0;
  padding: 0.5rem 1.5rem;
}

.shell-brand {
  font-weight: 600;
  font-size: 1.1rem;
  margin-right: 1.5rem;
}

:deep(.shell-active) > .p-menubar-item-content {
  background: #eff6ff;
  color: #1d4ed8;
}
</style>
