import * as React from "react"

import { ICallLog } from "../Store"
import { ContractMethodHeader } from "./partials/ContractMethodHeader"

const executionResultShowKeys = [
  "gasUsed",
  "excepted",
  // "newAddress", // what is this?
  "codeDeposit",
  "gasRefunded",
  "depositSize",
  "gasForDeposit",
]

export class CallRPCLog extends React.Component<{
  calllog: ICallLog,
}, {}> {
  public render() {
    const {
      contract,
      method: methodName,
      args,
      result,
    } = this.props.calllog

    const method = contract.abi.find((abiMethod) => abiMethod.name === methodName)

    if (!method) {
      return <div>method not found</div>
    }

    const hasArgs = method.inputs.length > 0
    const hasOutputs = result.outputs.length > 0

    const tag = {
      label: "call",
    }

    return (
      <div className="box content">
        <ContractMethodHeader contract={contract} method={method} tags={[tag]} />
        <h4>Execution Result</h4>
        <table>
          {executionResultShowKeys.map((key) => {
            const val = (result.executionResult as any)[key]
            if (val === 0 || val === "") {
              return null
            }

            if (key === "excepted" && val === "None") {
              return null
            }

            return (
              <tr>
                <td>{key}</td>
                <td>{val}</td>
              </tr>
            )
          })}
        </table>

        {hasArgs &&
          <div>
            <h4>Inputs</h4>
            <table className="table is-bordered">
              {args.map((val, i) => {
                const {
                  name,
                  type,
                } = method.inputs[i]

                return (
                  <tr>
                    <td>{name}</td>
                    <td>{type}</td>
                    <td className="has-text-right">{val.toString()}</td>
                  </tr>
                )
              })}
            </table>
          </div>
        }

        {hasOutputs &&
          <div>
            <h4>Outputs</h4>
            <table className="table is-bordered">
              {result.outputs.map((val, i) => {
                const {
                  type,
                } = method.outputs[i]

                return (
                  <tr>
                    <td>{type}</td>
                    <td className="has-text-right">{val.toString()}</td>
                  </tr>
                )
              })}
            </table>
          </div>
        }
      </div>
    )
  }
}
