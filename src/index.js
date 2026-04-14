import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import env from "./utils/env"
import App from "./App"

const rootPath = env.ROOT_PATH() ? `/${env.ROOT_PATH().replace(/^\/|\/$/g, "")}` : ""

const el = document.getElementById("root")
const root = ReactDOM.createRoot(el)

root.render(
  <BrowserRouter basename={rootPath}>
    <App />
  </BrowserRouter>
)
