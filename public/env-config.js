// Placeholder runtime environment configuration.
// Vite (unlike CRA/webpack) needs this file to physically exist so its HTML
// build step treats the <script src="%BASE_URL%env-config.js"> reference in
// index.html as a public/ passthrough asset rather than something to bundle.
// On the Docker/nginx deploy path, scripts/generate-env-config.sh overwrites
// this with real values at container start (see Dockerfile). The PM2/Ansible
// path never invokes that script (confirmed - see
// .claude/brain/task/vite-migration-and-lazy-loading-plan.md Phase 0 #2), so
// window._env_ stays empty there and src/utils/env.ts falls through to its
// build-time (import.meta.env / process.env) values - same as today.
window._env_ = {};
