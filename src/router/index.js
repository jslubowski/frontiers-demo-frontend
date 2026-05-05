import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', redirect: '/users' },
  { path: '/users', name: 'users', component: () => import('@/views/UsersPage.vue') },
  {
    path: '/users/:id',
    name: 'user-detail',
    component: () => import('@/views/UserDetailPage.vue'),
    props: true,
  },
  {
    path: '/invitations',
    name: 'invitations',
    component: () => import('@/views/InvitationsPage.vue'),
  },
  {
    path: '/invitations/:id',
    name: 'invitation-detail',
    component: () => import('@/views/InvitationDetailPage.vue'),
    props: true,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
