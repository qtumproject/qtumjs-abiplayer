import "normalize.css"
import "./index.css"

import * as React from "react"
import { render } from "react-dom"

import { App } from "./views/App"

window.Buffer = require("buffer").Buffer

window.addEventListener("load", () => {
  render(<App />, document.getElementById("root"))
})

