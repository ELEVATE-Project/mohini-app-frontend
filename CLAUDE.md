# Project: mohini-app-frontend

## What This Project Is

React 18 single-page application for **Shikshalokam** (education-tech nonprofit) — the client for the
`mitra-service` (Mohini) chatbot backend. Voice-based AI chat, PDF story export, and structured
discussion flows (Mitra coaching, PTM, YLC) for teachers, students, and community stakeholders in
Indian schools. Talks to the backend over REST (`REACT_APP_LOCAL_PROXY`) and WebSocket
(`REACT_APP_WEBSOCKET_HOST` + `REACT_APP_WS_PROTOCOL`).

This is a sibling repo to `mitra-service` — they deploy to the same hosts and share the same Vault
instance for secrets. See `mitra-service/CLAUDE.md` for the backend's conventions.

Stack: React 18 (Create React App / `react-scripts`) · TypeScript + JS (mixed) · Zustand · TanStack
Query · Tailwind CSS · PrimeReact · i18next · Playwright (e2e)

## Project Structure

```
src/
├── api/            # API service calls (ai, auth, chat, flow, story, upload, user)
├── components/     # Reusable React components
├── hooks/          # Custom hooks (useFlow, useLanguage, useAudio, useStorage, useChatWebhook)
├── pages/          # Page-level components (ai-creation/Mitra, ShikshalokamVoiceChat, MegaPTM, story, ...)
├── services/       # Business logic services (API, audio, storage)
├── store/          # Zustand slices (chat, user, site, AI creation)
├── utils/          # env.ts, helpers.js, axios config
└── deployment/
    └── ansible.yml # Deploy playbook - see "Deployment" below

tests/              # Playwright e2e specs, fixtures, page objects
```

## Code Conventions

- Mixed TypeScript (`.ts`/`.tsx`) and plain JS (`.js`/`.jsx`) — newer code (hooks, utils) tends to be
  TS; older page components are often still `.js`/`.jsx`. Match the file you're editing.
- All env var access goes through `src/utils/env.ts`'s `env.X()` getters, **not** `process.env.X`
  directly — this layer checks `window._env_` (runtime-injected) before falling back to
  `process.env` (build-time), so a value can be swapped after the build without a rebuild.
- Two separate env files, easy to confuse: `.env` (`REACT_APP_LOCAL_PROXY`, `REACT_APP_WEBSOCKET_HOST`,
  etc. — read via `process.env` at build time) vs `.env-cmdrc` (per-environment blocks — `dev`/`demo`/
  `prod`/`docker` — selected by `env-cmd -e <env>` in the `npm run <env>`/`build-<env>` scripts).
- ESLint config is `react-app`/`react-app/jest` (CRA defaults) — no custom ESLint rules layered on top.

## WebSocket Chat

- `useChatWebhook` (`src/hooks/useChatWebhook.ts`) is the reconnecting WebSocket wrapper most flows
  use. It takes a full URL string built by the caller — there is no central URL-building layer, each
  page/hook constructs its own via `${env.WS_PROTOCOL()}://${env.WEBSOCKET_HOST()}/<path>/`.
- The path must exactly match a route registered in the **backend's** `chatbot/routing.py`
  (`ws/common/`, `ws/mitra/`, `ws/shikshalokam_chaupal/`, etc.). A path that doesn't exist there gets
  a plain HTTP 404 on the WebSocket handshake, not a WS-level error — check the backend's
  `websocket_urlpatterns` first when a WS connection 404s.
- **Known bug, not yet fixed**: `src/utils/helpers.js`'s `buildWebSocketUrl()` has a branch (triggered
  when the URL has a `?code=` query param) that points at `/ws/chat/company/` — a path that has never
  existed in the backend's routing. Flagged in its own code comment (`// NOTE: revert this code after
  testing`) as leftover test code. Needs a decision on whether to point it at `ws/common/` (the
  backend's stated "single new route for all flows") or remove the branch — see `primer.md` for
  context on where this was last discussed.

## Deployment

- Deployed via `src/deployment/ansible.yml`, triggered by a Jenkins job whose pipeline script is
  pasted directly into Jenkins config (same convention as `mitra-service`'s Jenkinsfile — not checked
  into this repo long-term; a working copy may sit at the repo root temporarily for review).
- Runs on the **same host and shares the same Vault token** (`/opt/deployment/.token`) as the backend
  deploy — see `mitra-service`'s `deploy.yml` for that host's other prerequisites (passwordless sudo
  for `jenkins`, `uv` on `secure_path`, etc.).
- Node.js is managed via **nvm at `/root/.nvm`** on the deploy host, resolved dynamically per-deploy
  (not a fixed version) — see the `Resolve nvm-managed Node bin directory` task.
- Install step is `npm ci` (not `npm i --force`) — deliberately reproducible, installs strictly from
  the committed `package-lock.json`. Don't reintroduce lock-file deletion or `--force`; both
  reintroduce version drift across deploys of the same commit.
- Build step (`npm run build-prod`) pins `NODE_OPTIONS=--max-old-space-size=4096` explicitly — V8's
  auto-computed default heap ceiling is environment-dependent (varies with what else is running on
  the host and how the process is launched) and was observed to OOM under Ansible/sudo even when the
  same build succeeded manually on the same host.
- Runs under **PM2** in production (`pm2 start pm2.config.json`), not systemd, unlike the backend's
  `mitra-uvicorn`/`mitra-celery` services. Each environment fetches its **own** `pm2.config.json` from
  Vault at deploy time (app name, port) — the committed `pm2.config.json` at the repo root (port
  `1819`, app name `mohini-app`) is only the local/manual-run default, not what's actually deployed.
- `server.js` is a minimal Express static server serving the CRA build under `/mohini`, used by the
  PM2 production path. The Docker path (`Dockerfile`, `nginx.conf`) is a separate multi-stage
  build-then-nginx setup, unrelated to the PM2/Ansible path — don't assume the two are kept in sync.

## Never Do

- Never delete `package-lock.json` or use `npm install --force` in the deploy playbook — breaks
  deploy reproducibility (see "Deployment" above).
- Never `debug:`-print Vault-fetched secret content in `ansible.yml` — it lands in the Jenkins build
  log, readable by anyone with job access. Keep validation checks; drop the content dump.
- Never assume a manual build succeeding on the deploy host proves the Ansible/Jenkins-triggered build
  will also succeed — they can run under different resource conditions (see `NODE_OPTIONS` note above).
- Never edit code files when the ask is documentation/analysis/functional description writing only.

## SESSION MANAGEMENT (CRITICAL)

At the end of EVERY session, you must rewrite primer.md completely.
Include:
1. Current state of the project
2. What was accomplished this session
3. Immediate next steps (specific, actionable)
4. Any open blockers or unresolved issues
5. Any important decisions made this session
