import * as React from "react"

const css = require("./Spinner.css")

//  ${css.spinner}
export function Spinner(props = {}) {
  return <span className={`fa fa-spinner spin`}></span>
}
