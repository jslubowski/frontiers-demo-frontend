<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Message from 'primevue/message';

import { useUsersStore } from '@/stores/users';

const toast = useToast();
const usersStore = useUsersStore();
const { submitting, submitError, submitFieldErrors } = storeToRefs(usersStore);

const emptyForm = () => ({ userName: '', universityName: '', numberOfPublications: null });

const visible = ref(false);
const form = ref(emptyForm());

const fieldError = (name) => submitFieldErrors.value[name]?.join(' ') ?? '';

const isValid = (f) =>
  f.userName.trim().length > 0 &&
  f.universityName.trim().length > 0 &&
  typeof f.numberOfPublications === 'number' &&
  f.numberOfPublications >= 0;

const open = () => {
  form.value = emptyForm();
  usersStore.clearSubmitError();
  visible.value = true;
};

const submit = async () => {
  if (!isValid(form.value)) return;
  const ok = await usersStore.register({
    userName: form.value.userName.trim(),
    universityName: form.value.universityName.trim(),
    numberOfPublications: form.value.numberOfPublications,
  });
  if (ok) {
    visible.value = false;
    toast.add({ severity: 'success', summary: 'User registered', life: 3000 });
  }
};

defineExpose({ open });
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Register user"
    :style="{ width: '28rem' }"
    :closable="!submitting"
  >
    <form class="form" @submit.prevent="submit">
      <label class="field">
        <span>Name</span>
        <InputText
          v-model="form.userName"
          autofocus
          :disabled="submitting"
          :invalid="!!fieldError('userName')"
        />
        <small v-if="fieldError('userName')" class="field-error">
          {{ fieldError('userName') }}
        </small>
      </label>
      <label class="field">
        <span>University</span>
        <InputText
          v-model="form.universityName"
          :disabled="submitting"
          :invalid="!!fieldError('universityName')"
        />
        <small v-if="fieldError('universityName')" class="field-error">
          {{ fieldError('universityName') }}
        </small>
      </label>
      <label class="field">
        <span>Number of publications</span>
        <InputNumber
          v-model="form.numberOfPublications"
          :min="0"
          :use-grouping="false"
          :disabled="submitting"
          show-buttons
          :invalid="!!fieldError('numberOfPublications')"
        />
        <small v-if="fieldError('numberOfPublications')" class="field-error">
          {{ fieldError('numberOfPublications') }}
        </small>
      </label>

      <Message v-if="submitError" severity="error" :closable="false">{{ submitError }}</Message>

      <footer class="actions">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          :disabled="submitting"
          @click="visible = false"
        />
        <Button type="submit" label="Register" :loading="submitting" :disabled="!isValid(form)" />
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

.field-error {
  font-size: 0.8rem;
  color: #ef4444;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>
