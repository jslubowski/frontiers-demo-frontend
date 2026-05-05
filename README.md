# Frontiers Demo — Frontend

[![GitHub](https://img.shields.io/badge/GitHub-frontiers--demo--frontend-blue?logo=github)](https://github.com/jslubowski/frontiers-demo-frontend)

Vue 3 + PrimeVue frontend for the Frontiers Demo API. Allows registering researchers, browsing them, and managing reviewer invitations.

## Prerequisites

- **Node.js** `^20.19.0` or `>=22.12.0`
- **Frontiers Demo API** running at `http://localhost:5090` (CORS must allow `http://localhost:5173`) — [source](https://github.com/jslubowski/FrontiersDemo)

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens at **http://localhost:5173**. The port is fixed — if it is already in use, Vite will exit with an error.

## Production build

```bash
npm run build
```

Output is written to `dist/`. Serve it with any static file server, or preview locally:

```bash
npm run preview
```

By default the app calls the API at `http://localhost:5090`. Override this for production by setting the environment variable before building:

```bash
VITE_API_BASE_URL=https://api.example.com npm run build
```

## Code formatting

```bash
npm run format
```

Runs Prettier over all `src/**/*.{js,vue}` files (semicolons enforced, single quotes, 100-char line width).

## Project structure

```
src/
├── api/              # Fetch wrappers (client, users, reviewers, error helpers)
├── assets/           # Global CSS
├── components/
│   ├── AppShell.vue  # Top navigation bar
│   ├── users/
│   │   └── modals/
│   │       └── RegisterUserDialog.vue
│   └── reviewers/
│       └── modals/
│           └── InviteReviewerDialog.vue
├── router/           # Vue Router (5 routes)
├── stores/           # Pinia stores (users, reviewers)
└── views/            # Page components
    ├── UsersPage.vue
    ├── UserDetailPage.vue
    ├── InvitationsPage.vue
    └── InvitationDetailPage.vue
```
