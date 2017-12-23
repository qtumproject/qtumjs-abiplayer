import { autorun, toJS } from "mobx"
import { inject, observer } from "mobx-react"
import { IABIMethod, IDeployedContractInfo, IContractSendRequestOptions } from "qtumjs"
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
  contract: IDeployedContractInfo
  method: IABIMethod

  // injected store
  store: Store,
}

function Caret(props: { showing: boolean }) {
  const caret = props.showing ? "fa fa-caret-down" : "fa fa-caret-right"
  return <span className={caret} />
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
      showCalldata,
      showSettings,
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
                <input className="input" type="number" placeholder="0"
                  onChange={(e) => {
                    this.vstore.value = e.target.valueAsNumber
                  }} />
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
                {!constant &&
                  <div>
                    <a
                      onClick={() => {
                        this.vstore.showSettings = !showSettings
                      }}
                    > <Caret showing={showSettings} /> Settings </a>

                    {showSettings &&
                      <div>
                        <div className="field">
                          <label className="label">Gas Price</label>
                          <div className="control">
                            <input className="input" type="number"
                              placeholder="default: 0.00000001"
                              onChange={(e) => {
                                this.vstore.gasPrice = e.target.valueAsNumber
                              }} />
                          </div>
                        </div>

                        <div className="field">
                          <label className="label">Gas Limit</label>
                          <div className="control">
                            <input className="input"
                              type="number"
                              placeholder="default: 200000"
                              onChange={(e) => {
                                this.vstore.gasLimit = e.target.valueAsNumber
                              }}
                            />
                          </div>
                        </div>

                        <div className="field">
                          <label className="label">Sender</label>
                          <div className="control">
                            <input className="input" type="text" placeholder="0"
                              onChange={(e) => {
                                this.vstore.sender = e.target.value.trim()
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                }

                <div>
                  <a onClick={() => {
                    this.vstore.showCalldata = !this.vstore.showCalldata
                  }}
                  >
                    <Caret showing={showCalldata} /> Call Data
                  </a>

                  {showCalldata &&
                    <code className={`has-text-grey ${css.calldata}`}>
                      {this.vstore.encodedABIcalldata}
                    </code>
                  }
                </div>
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
                  const {
                    value,
                    gasLimit,
                    gasPrice,
                    sender,
                  } = this.vstore
                  const opts: IContractSendRequestOptions = {}

                  if (payable && this.vstore.value > 0) {
                    opts.amount = this.vstore.value
                  }

                  if (gasLimit && gasLimit > 0) {
                    opts.gasLimit = gasLimit
                  }

                  if (gasPrice && gasPrice > 0) {
                    opts.gasPrice = gasPrice
                  }

                  if (sender && sender !== "") {
                    opts.senderAddress = sender
                  }

                  rpcSend(this.props.contract, methodName, this.vstore.paramValues, opts)

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
