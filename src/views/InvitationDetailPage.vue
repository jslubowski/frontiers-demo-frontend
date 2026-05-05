<script setup>
import { computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';

import { useReviewersStore } from '@/stores/reviewers';
import { useUsersStore } from '@/stores/users';

const props = defineProps({ id: { type: [String, Number], required: true } });

const router = useRouter();
const reviewersStore = useReviewersStore();
const usersStore = useUsersStore();

const { loadingDetail, detailError } = storeToRefs(reviewersStore);

const invitation = computed(() => reviewersStore.getById(props.id));
const invitedUser = computed(() =>
  invitation.value ? usersStore.getById(invitation.value.userId) : null,
);

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'long',
  timeStyle: 'short',
});

const formattedDate = computed(() => {
  if (!invitation.value?.invitedAt) return '';
  const d = new Date(invitation.value.invitedAt);
  return Number.isNaN(d.getTime()) ? invitation.value.invitedAt : dateFormatter.format(d);
});

const load = async () => {
  const inv = await reviewersStore.fetchById(props.id);
  if (inv && !usersStore.getById(inv.userId)) {
    await usersStore.fetchById(inv.userId);
  }
};

watch(() => props.id, load);
onMounted(load);
</script>

<template>
  <section>
    <Button
      icon="pi pi-arrow-left"
      label="Back to invitations"
      severity="secondary"
      text
      class="back-button"
      @click="router.push('/invitations')"
    />

    <div v-if="loadingDetail && !invitation" class="loading">
      <ProgressSpinner />
    </div>

    <Message v-else-if="detailError" severity="error" :closable="false">{{ detailError }}</Message>

    <Card v-else-if="invitation">
      <template #title>Invitation #{{ invitation.id }}</template>
      <template #subtitle>{{ formattedDate }}</template>
      <template #content>
        <dl class="fields">
          <div>
            <dt>Invited user</dt>
            <dd>
              <RouterLink :to="{ name: 'user-detail', params: { id: invitation.userId } }">
                {{ invitedUser?.userName ?? `User #${invitation.userId}` }}
              </RouterLink>
            </dd>
          </div>
          <div v-if="invitedUser">
            <dt>University</dt>
            <dd>{{ invitedUser.organizationName }}</dd>
          </div>
          <div v-if="invitedUser">
            <dt>Publications</dt>
            <dd>{{ invitedUser.numberOfPublications }}</dd>
          </div>
          <div>
            <dt>Invited at (raw)</dt>
            <dd>
              <code>{{ invitation.invitedAt }}</code>
            </dd>
          </div>
        </dl>
      </template>
    </Card>
  </section>
</template>

<style scoped>
.back-button {
  margin-bottom: 1rem;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin: 0;
}

.fields > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.fields dt {
  font-size: 0.8rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.fields dd {
  margin: 0;
  font-size: 1rem;
}

.fields a {
  color: #2563eb;
  text-decoration: none;
}

.fields a:hover {
  text-decoration: underline;
}
</style>
