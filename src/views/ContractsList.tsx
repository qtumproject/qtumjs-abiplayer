import { IABI } from "qtumjs"
import * as React from "react"

const css = require("./ContractsList.css")

interface IContract {
  name: string
  deployName: string
  address: string
  abi: IABI[]
}

interface IContractsMap {
  [key: string]: IContract
}

function Contract(props: { contract: IContract }) {
  const {
    name,
    deployName,
    address,
    abi,
  } = props.contract

  const methods = abi.filter((method) => method.name !== "")

  const noMethod = methods.length === 0

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
              <a className={`button ${buttonType} ${css.methodButton}`}>{methodName}</a>
            )
          })
        }
      </p>
    </div>
  )
}

export function ContractsList(props: { contracts: IContract[] }) {
  const {
    contracts,
  } = props

  return (
    <div>
      {
        contracts.map((contract) => <Contract key={contract.deployName} contract={contract} />)
      }
    </div>
  )
}
