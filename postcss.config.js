// Vite (unlike CRA/webpack) does not run PostCSS at all without this file -
// without it, the `@tailwind base/components/utilities` directives in
// src/index.css pass through unprocessed, so no Tailwind utility classes
// (layout, colors, responsive `hidden`/breakpoint classes, etc.) exist in
// the build at all.
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
