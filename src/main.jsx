// Vite-only entry point (Plan B scaffolding). Mirrors src/index.js, which
// stays as CRA's entry - kept separate rather than renamed, so both build
// tools coexist. Vite's HTML-entry parser (distinct from its per-module
// transform pipeline) requires the file index.html directly references to
// have a .jsx/.tsx extension when it contains JSX, even though the same JSX
// inside plain .js files reached via import (like App.jsx) is handled fine by
// @vitejs/plugin-react's normal transform.
import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import env from "./utils/env"

// Runtime env config (window._env_, see public/env-config.js) is loaded here
// as a dynamically-injected classic <script>, not a static <script> tag in
// index.html. Vite's build step requires type="module" on any local script
// src, but Vite's dev server refuses to treat a public/-resolved file as an
// ES module (its import-analysis explicitly rejects it, logging "Pre-transform
// error: ... should not be imported from source code") - the two requirements
// contradict each other for a single static HTML tag. Loading it at browser
// runtime instead sidesteps both: it's a plain GET request against Vite's
// normal public/ static-file serving, not routed through either its HTML
// build processing or its dev-server module graph.
function loadEnvConfig() {
  return new Promise(resolve => {
    const script = document.createElement("script")
    script.src = `${import.meta.env.BASE_URL}env-config.js`
    script.onload = resolve
    script.onerror = resolve // don't block app boot if the file is missing
    document.head.appendChild(script)
  })
}

loadEnvConfig().then(() => {
  const rootPath = env.ROOT_PATH() ? `/${env.ROOT_PATH().replace(/^\/|\/$/g, "")}` : ""

  const el = document.getElementById("root")
  const root = ReactDOM.createRoot(el)

  root.render(
    <BrowserRouter basename={rootPath}>
      <App />
    </BrowserRouter>
  )
})
