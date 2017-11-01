import { Contract, IContractInfo, QtumRPC } from "qtumjs"
import * as React from "react"

const css = require("./App.css")

import { IContractsInventory } from "../types"
import { ChooseFile } from "./ChooseFile"
import { ContractsList } from "./ContractsList"
import { History } from "./History"
import { Modal } from "./Modal"

export class App extends React.Component<{}, {}> {
  public render() {
    // Components with store injected
    const ChooseFile_: any = ChooseFile
    const ContractsList_: any = ContractsList
    const Modal_: any = Modal
    const History_: any = History

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
              <History_ />
            </div>
          </div>

          <Modal_ />

          {/* <div className="filedropper"
          onDragOver={this.onDragOver.bind(this)}
          onDrop={this.onDrop.bind(this)}>
           */}
        </div>
      </div>
    )
  }

  // private quickConfirm = () => {
  //   rpc.rawCall("")
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
