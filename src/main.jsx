// Vite-only entry point (Plan B scaffolding). Identical to src/index.js, which
// stays as CRA's entry - kept separate rather than renamed, so both build
// tools coexist. Vite's HTML-entry parser (distinct from its per-module
// transform pipeline) requires the file index.html directly references to
// have a .jsx/.tsx extension when it contains JSX, even though the same JSX
// inside plain .js files reached via import (like App.js) is handled fine by
// @vitejs/plugin-react's normal transform.
import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import env from "./utils/env"

const rootPath = env.ROOT_PATH() ? `/${env.ROOT_PATH().replace(/^\/|\/$/g, "")}` : ""

const el = document.getElementById("root")
const root = ReactDOM.createRoot(el)

root.render(
  <BrowserRouter basename={rootPath}>
    <App />
  </BrowserRouter>
)
