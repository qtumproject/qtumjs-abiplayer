import "bulma/css/bulma.css"
import "font-awesome/css/font-awesome.css"

import "./index.css"

import { Provider } from "mobx-react"
import * as React from "react"
import { render } from "react-dom"

import { Store } from "./Store"
import { IContractsInventory } from "./types"
import { App } from "./views/App"

const { Buffer } = require("buffer")
Object.assign(window, {
  Buffer,
})

window.addEventListener("load", () => {
  const store = new Store()

  // const inventory: IContractsInventory = require("../solar.development.json")
  // store.setInventory(inventory)

  // store.
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root"),
  )
})
