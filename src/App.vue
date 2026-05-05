<script setup>
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import AppShell from '@/components/AppShell.vue';
</script>

<template>
  <AppShell />
  <main class="page">
    <RouterView />
  </main>
  <Toast position="bottom-right" />
  <ConfirmDialog />
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}
</style>
