<script setup>
import { computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';

import { useUsersStore } from '@/stores/users';
import { useReviewersStore } from '@/stores/reviewers';

const props = defineProps({ id: { type: [String, Number], required: true } });

const router = useRouter();
const toast = useToast();
const usersStore = useUsersStore();
const reviewersStore = useReviewersStore();

const { loadingDetail, detailError } = storeToRefs(usersStore);
const { inviting, inviteError } = storeToRefs(reviewersStore);

const user = computed(() => usersStore.getById(props.id));

const load = async () => {
  reviewersStore.clearInviteError();
  await usersStore.fetchById(props.id);
};

const invite = async () => {
  if (!user.value) return;
  const ok = await reviewersStore.invite(user.value.id);
  if (ok) {
    toast.add({
      severity: 'success',
      summary: 'Reviewer invited',
      detail: `${user.value.userName} was invited`,
      life: 3000,
    });
    router.push('/invitations');
  }
};

watch(() => props.id, load);
onMounted(load);
</script>

<template>
  <section>
    <Button
      icon="pi pi-arrow-left"
      label="Back to users"
      severity="secondary"
      text
      class="back-button"
      @click="router.push('/users')"
    />

    <div v-if="loadingDetail && !user" class="loading">
      <ProgressSpinner />
    </div>

    <Message v-else-if="detailError" severity="error" :closable="false">{{ detailError }}</Message>

    <Card v-else-if="user">
      <template #title>{{ user.userName }}</template>
      <template #subtitle>User #{{ user.id }}</template>
      <template #content>
        <dl class="fields">
          <div>
            <dt>University</dt>
            <dd>{{ user.organizationName }}</dd>
          </div>
          <div>
            <dt>City</dt>
            <dd>{{ user.city }}</dd>
          </div>
          <div>
            <dt>Country</dt>
            <dd>{{ user.country }}</dd>
          </div>
          <div>
            <dt>Publications</dt>
            <dd>{{ user.numberOfPublications }}</dd>
          </div>
          <div>
            <dt>Organization ID</dt>
            <dd>{{ user.organizationId }}</dd>
          </div>
        </dl>

        <Message v-if="inviteError" severity="error" :closable="false" class="invite-error">
          {{ inviteError }}
        </Message>
      </template>
      <template #footer>
        <Button
          icon="pi pi-envelope"
          label="Invite as reviewer"
          :loading="inviting"
          @click="invite"
        />
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

.invite-error {
  margin-top: 1.25rem;
}
</style>
