// Placeholder runtime environment configuration.
// Loaded dynamically by src/main.jsx before the app renders (not a static
// <script> tag in index.html - see that file's comment for why). This
// placeholder still needs to physically exist here so Vite's build step
// copies it into build/ verbatim, same as CRA's public/ directory did.
// On the Docker/nginx deploy path, scripts/generate-env-config.sh overwrites
// this with real values at container start (see Dockerfile). The PM2/Ansible
// path never invokes that script (confirmed - see
// .claude/brain/task/vite-migration-and-lazy-loading-plan.md Phase 0 #2), so
// window._env_ stays empty there and src/utils/env.ts falls through to its
// build-time (import.meta.env / process.env) values - same as today.
window._env_ = {};
