import { inject, observer } from "mobx-react"
import { IABIMethod, IContractInfo } from "qtumjs"
import * as React from "react"

import { Store } from "../Store"
import { MethodForm } from "./MethodForm"

const css = require("./ContractItem.css")

export const ContractItem = observer((props: {
  contract: IContractInfo,
  store: Store,
}) => {
  const {
    store,
  } = props

  const {
    name,
    deployName,
    address,
    abi,
  } = props.contract

  const methods = abi.filter((method) => method.name !== "" && method.type !== "event")

  const noMethod = methods.length === 0

  const MethodForm_: any = MethodForm

  return (
    <div className="box content">
      <p>
        <strong>{deployName}</strong> {name}
        <br />
        <span className={css.address}>{address}</span>
      </p>

      <p>
        {noMethod && "Contract has no method"}

        {
          methods.map((method) => {
            const {
              name: methodName,
              constant,
            } = method

            const buttonType = constant ? "is-light" : "is-link"

            return (
              <button key={methodName} className={`button ${buttonType} ${css.methodButton}`}
                onClick={() => {
                  store.showModal(() => {
                    return (
                      <MethodForm_ contract={props.contract} method={method} />
                    )
                  })
                }}>
                {methodName}
              </button>
            )
          })
        }
      </p>
    </div>
  )
})
