import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import fs from "node:fs"

const srcDir = path.resolve(process.cwd(), "src")

// CRA resolves bare imports like `import X from "pages/foo"` relative to
// src/ via NODE_PATH (react-scripts/config/env.js sets process.env.NODE_PATH
// to include src/, which webpack's resolve.modules then honors). Vite has no
// built-in equivalent, and this pattern is used ~150+ times across the
// codebase (confirmed via grep - far too pervasive to fix import-by-import),
// so replicate it with one alias per top-level src/ entry instead.
const srcRootAliases = Object.fromEntries(
  fs.readdirSync(srcDir).map(entry => [entry.replace(/\.[^.]+$/, ""), path.join(srcDir, entry)])
)

// Vite migration (Plan B in .claude/brain/task/vite-migration-and-lazy-loading-plan.md).
// package.json's dev/build-* scripts now run vite/vite build directly (Phase 4) -
// react-scripts is still a dependency (only "eject" still uses it) but is no
// longer the live build path. See the plan doc's Phase 0 audit for why these
// specific settings were chosen:
//   - base/PORT mirror CRA's homepage ("/mohini") and .env-cmdrc PORT values.
//   - envPrefix keeps the existing REACT_APP_* var names working unchanged
//     (Vault secrets, .env-cmdrc, and app code all reference REACT_APP_*;
//     renaming to VITE_* would touch all three for no benefit).
//   - outDir stays "build" so server.js, Dockerfile, and nginx.conf don't need
//     to change paths during the coexistence period.
export default defineConfig({
  plugins: [react()],
  base: "/mohini/",
  envPrefix: "REACT_APP_",
  resolve: {
    alias: srcRootAliases,
  },
  server: {
    port: Number(process.env.PORT) || 3005,
  },
  build: {
    outDir: "build",
    // Vite auto-discovers every *.html in the project as a potential entry
    // otherwise, which picks up stray files like playwright-report/index.html
    // (a generated test artifact, not an app page).
    rollupOptions: {
      input: "index.html",
    },
  },
  // No custom esbuild/optimizeDeps JSX-loader override needed: every .js file
  // that actually contained JSX was renamed to .jsx (see git history / plan
  // doc) - @vitejs/plugin-react's default include (.js/.jsx/.ts/.tsx) handles
  // the rest. An earlier version of this config forced loader:"jsx" globally,
  // which broke .ts files (esbuild tried to parse TypeScript syntax as JS).
})
