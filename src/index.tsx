import "bulma/css/bulma.css"
// import "normalize.css"

import "./index.css"

import * as React from "react"
import { render } from "react-dom"

import { App } from "./views/App"

const { Buffer } = require("buffer")
Object.assign(window, {
  Buffer,
})

window.addEventListener("load", () => {
  render(<App />, document.getElementById("root"))
})
