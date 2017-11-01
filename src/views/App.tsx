import { Contract, IContractInfo, QtumRPC } from "qtumjs"
import * as React from "react"

const css = require("./App.css")

import { IContractsInventory } from "../types"
import { ChooseFile } from "./ChooseFile"
import { ContractsList } from "./ContractsList"
import { Modal } from "./Modal"

interface IState {
  selectedContract?: IContractInfo
}

// tslint:disable-next-line:no-empty-interface
interface IProp { }

export class App extends React.Component<IProp, IState> {
  constructor(props: IProp) {
    super(props)

    this.state = {
    }
  }

  public render() {
    const {
      selectedContract,
    } = this.state

    const showModal = false

    // Components with store injected
    const ChooseFile_: any = ChooseFile
    const ContractsList_: any = ContractsList
    const Modal_: any = Modal

    return (
      <div>
        <nav className="navbar" role="navigation">
          <div className="navbar-brand">
            <span className="navbar-item">
              QTUM ABI Explorer
            </span>
          </div>
        </nav>

        <div className={`container ${css.main}`} >
          <div className="columns">
            <div className="column">

              <div className="content">
                <h3>Deployed Contracts</h3>
                <ChooseFile_ />
              </div>

              <ContractsList_ />
            </div>

            <div className="column">
              <div className="box">
                Transaction 1
            </div>

              <div className="box">
                Transaction 2
            </div>

              <div className="box">
                Transaction 3
            </div>
            </div>
          </div>

          <Modal_ />

          {/* <div className="filedropper"
          onDragOver={this.onDragOver.bind(this)}
          onDrop={this.onDrop.bind(this)}>

          <input type="file" onChange={this.onFileInputChange} />
        </div> */}

          {/* <div>
          {this.renderContracts(contracts)}
        </div> */}

          {selectedContract && this.renderContract(selectedContract)}
        </div>
      </div>
    )
  }

  private quickConfirm = () => {
    rpc.rawCall("")
  }

  private renderContract(contract: IContractInfo) {
    const methods = contract.abi.filter((method: any) => method.name !== "")

    const qContract = new Contract(rpc, contract)

    if (methods.length === 0) {
      return "contract has no method"
    }

    const methodForms = methods.map((method: any) => {
      const {
          name,
        inputs,
      } = method

      const params: any[] = []

      let i = 0
      const inputFields = inputs.map((arg: any) => {
        i++
        const j = i - 1
        return (
          <p key={arg.name}>
            <label>{arg.name}</label>
            <input onChange={(e) => {
              params[j] = e.target.value
            }} />
          </p>
        )
      })

      return (
        <div style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
          <h3>{method.name}</h3>
          {inputFields}
          <button onClick={async () => {
            const calldata = qContract.encodeParams(method.name, params)

            console.log("call", method.name, params)
            console.log("abi call data", calldata)

            const result = await qContract.call(method.name, params)

            console.log("result", result)
          }}>Call</button>
          {!method.constant &&
            <button onClick={async () => {
              const calldata = qContract.encodeParams(method.name, params)
              console.log("send", method.name, params)
              console.log("abi call data", calldata)

              const receipt = await qContract.send(method.name, params)
              console.log("txid", receipt.txid)
              while (true) {
                console.log("check confirmation")
                if (await receipt.check(1)) {
                  break
                }

                await sleep(1000)
              }
              console.log("confirmed send", method.name)
            }}>Send</button>
          }
        </div>
      )
    })

    return (
      <div>
        <h2> {contract.deployName} ({contract.name}) </h2>
        {methodForms}
      </div>
    )
  }

  // private renderContracts(contracts: IContractsMap) {
  //   return (
  //     <ul>
  //       {Object.keys(contracts).map((key) => {
  //         const contract = contracts[key]
  //         const {
  //           name,
  //           deployName,
  //           address,
  //         } = contract
  //         return (
  //           <li key={key}>
  //             <a href="#" onClick={() => this.chooseContract(contract)}>
  //               {deployName} ({name}) => {address}
  //             </a>
  //           </li>
  //         )
  //       })}
  //     </ul>
  //   )
  // }

  private onDragOver(e: any) {
    e.preventDefault()
  }

  // private async onDrop(e: DragEvent) {
  //   e.preventDefault()

  //   // console.log("drop", e)

  //   const files = e.dataTransfer.files
  //   const f = files[0]
  //   console.log("open", f.name)

  //   const content = await readFile(f)
  //   this.setState({
  //     contracts: JSON.parse(content),
  //   })
  // }
}

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
