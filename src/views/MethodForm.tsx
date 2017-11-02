import { autorun, toJS } from "mobx"
import { inject, observer } from "mobx-react"
import { IABIMethod, IContractInfo } from "qtumjs"
import * as React from "react"

import { Store } from "../Store"
import { MethodFormStore } from "./MethodFormStore"
import { ContractMethodHeader, IContractMethodHeaderTag } from "./partials/ContractMethodHeader"

const css = require("./MethodForm.css")

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
  contract: IContractInfo
  method: IABIMethod

  // injected store
  store: Store,
}

@inject("store") @observer
export class MethodForm extends React.Component<IMethodFormProps, {}> {
  // local store for this component (more convenient than component state)
  private vstore: MethodFormStore

  constructor(props: IMethodFormProps) {
    super(props)

    const store = new MethodFormStore(props.method)
    this.vstore = store
  }

  public render() {
    const {
      name: methodName,
      payable,
      constant,
    } = this.props.method

    const {
      calldataEncodeError,
      showCalldataPreview,
    } = this.vstore

    const {
      hideModal,
      rpcCall,
      rpcSend,
    } = this.props.store

    const tags: IContractMethodHeaderTag[] = []
    if (payable) {
      tags.push({
        label: "payable",
        modifier: "is-success",
      })
    }

    if (constant) {
      tags.push({
        label: "constant",
      })
    }

    return (
      <div className="box content">
        <ContractMethodHeader contract={this.props.contract} method={this.props.method} tags={tags} />

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

          <div>
            {calldataEncodeError &&
              <span className="has-text-danger">
                {calldataEncodeError.message}
              </span>
            }

            {!calldataEncodeError &&
              <div>
                <button className="button is-text"
                  onClick={this.vstore.toggleCalldataPreview}>
                  Toggle Call Data Preview
                </button>

                {showCalldataPreview &&
                  <code className={`has-text-grey ${css.calldata}`}>{this.vstore.encodedABIcalldata}
                  </code>
                }

              </div>
            }
          </div>

          <hr />

          <p>
            <span className="is-pulled-right is-size-7">
              Free local simulated computation
            </span>
            <button className="button is-medium is-fullwidth"
              onClick={() => {
                rpcCall(this.props.contract, methodName, this.vstore.paramValues)
                hideModal()
              }}
              disabled={!!calldataEncodeError}
            >
              Call
            </button>
          </p>

          {
            !constant &&
            <p>
              <span className="is-pulled-right is-size-7">
                Create a transaction for global consensus
              </span>
              <button className="button is-medium is-success is-fullwidth"
                onClick={() => {
                  rpcSend(this.props.contract, methodName, this.vstore.paramValues)
                  hideModal()
                }}
                disabled={!!calldataEncodeError}
              >
                Send
              </button>
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

    this.vstore.updateInput(name, value)
  }
}
