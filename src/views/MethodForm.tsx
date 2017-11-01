import { autorun, toJS } from "mobx"
import { observer } from "mobx-react"
import { IABIMethod } from "qtumjs"
import * as React from "react"

import { IContract } from "../types"
import { MethodFormStore } from "./MethodFormStore"

function MethodParam(props: {
  method: IABIMethod,
}) {
  const {
    name,
  } = props.method
  return (
    <div className="field">
      <label className="label">{name}</label>
      <div className="control">
        <input className="input" type="text" placeholder="0" />
      </div>
    </div>
  )
}

interface IMethodFormProps {
  contract: IContract
  method: IABIMethod
}

@observer
export class MethodForm extends React.Component<IMethodFormProps, {}> {
  private store: MethodFormStore

  constructor(props: IMethodFormProps) {
    super(props)

    const store = new MethodFormStore()

    autorun(() => {
      console.log("inputs", JSON.stringify(toJS(store.inputs), null, 2))
    })

    this.store = store // new MethodFormStore()
  }

  public render() {
    const {
      deployName,
      name: contractName,
      address,
    } = this.props.contract

    const {
      name: methodName,
      payable,
      constant,
    } = this.props.method

    return (
      <div className="box content">
        <p>
          <strong>{deployName}</strong> {contractName} <span className="tag">{methodName}</span>
          {payable &&
            <span className="tag is-success is-pulled-right">
              payable
            </span>
          }

          {constant &&
            <span className="tag is-pulled-right">
              constant
            </span>
          }

          <br />
          <span className="is-size-7">{address}</span>
        </p>

        <div>
          {payable &&
            <div className="field">
              <label className="label">Value</label>
              <div className="control">
                <input className="input" type="text" placeholder="0" />
              </div>
            </div>
          }


          {this.props.method.inputs.map((arg) => {
            return (
              <div key={arg.name} className="field">
                <label className="label">
                  {arg.name}
                  <span className="is-pulled-right has-text-grey-light">{arg.type}</span>
                </label>

                <div className="control">
                  <input className="input" type="text" name={arg.name} onChange={this.onInputChange} />
                </div>
              </div>
            )
          })}

          <p>
            <a href="#">Preview Call Data</a>
          </p>

          <hr />

          <p>
            <span className="is-pulled-right is-size-7">
              Free read-only computation
            </span>
            <a className="button is-medium is-fullwidth">Call</a>
          </p>

          {
            !constant &&
            <p>
              <span className="is-pulled-right is-size-7">
                Create a transaction for global consensus
              </span>
              <a className="button is-medium is-success is-fullwidth">Send</a>
            </p>
          }
        </div>
      </div>
    )
  }

  public onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value,
    } = e.target

    this.store.updateInput(name, value)
  }
}
