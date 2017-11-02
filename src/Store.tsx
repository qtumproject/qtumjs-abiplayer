import { autorun, computed, observable, toJS } from "mobx"

import {
  Contract,
  IContractCallDecodedResult,
  IContractInfo,
  QtumRPC,
} from "qtumjs"

import { IContractsInventory } from "./types"

interface IUIState {
  modalRenderFunction?: () => any,
}

export type ModalRenderFunction = () => JSX.Element

async function readFileAsString(file: File): Promise<string> {
  const r = new FileReader()
  const p = new Promise<string>((resolve) => {
    r.addEventListener("loadend", (e) => {
      // resolve(e.target.)
      resolve(r.result)
    })

    r.addEventListener("error", (e) => {
      console.log("read error", e)
    })
  })

  r.readAsText(file)

  return p
}

async function readContractsInventory(file: File): Promise<IContractsInventory> {
  const content = await readFileAsString(file)
  return JSON.parse(content)
}

// FIXME make this user configurable
const rpc = new QtumRPC("http://localhost:9888")
// const rpc = new QtumRPC("http://localhost:13889")

export interface ICallLog {
  contract: IContractInfo
  method: string
  args: any[]
  result: IContractCallDecodedResult
}

export class Store {
  @observable public ui: IUIState = {}
  @observable public contractsInventoryJSONFile?: File
  @observable.ref public inventory: IContractsInventory = {}
  @observable.ref public modalRenderFunction?: ModalRenderFunction

  // tslint:disable-next-line:array-type
  @observable public logs: Array<ICallLog> = []

  constructor() {
    autorun(() => {
      console.log("logs", toJS(this.logs))
    })
  }

  @computed
  public get contracts(): IContractInfo[] {
    return Object.keys(this.inventory).map((key) => this.inventory[key])
  }

  public async useContractsInventoryJSONFile(file: File) {
    try {
      this.contractsInventoryJSONFile = file
      this.inventory = await readContractsInventory(file)
    } catch (err) {
      console.log("cannot read contracts inventory", err)
      this.contractsInventoryJSONFile = undefined
    }
  }

  public setInventory(inventory: IContractsInventory) {
    return this.inventory = inventory
  }

  public showModal = (renderFn: ModalRenderFunction) => {
    this.modalRenderFunction = renderFn
  }

  public hideModal = () => {
    console.log("hide modal")
    this.modalRenderFunction = undefined
  }

  public rpcCall = async (contract: IContractInfo, method: string, args: any[]) => {
    const c = new Contract(rpc, contract)

    const result = await c.call(method, args)

    const calllog: ICallLog = {
      contract,
      method,
      args,
      result,
    }

    this.logs.unshift(calllog)
  }

  // public rpcSend = (contract: IContractInfo, method: string, args: any[]) => {
  // }

  //             const calldata = qContract.encodeParams(method.name, params)
  //             console.log("send", method.name, params)
  //             console.log("abi call data", calldata)

  //             const receipt = await qContract.send(method.name, params)
  //             console.log("txid", receipt.txid)
  //             while (true) {
  //               console.log("check confirmation")
  //               if (await receipt.check(1)) {
  //                 break
  //               }

  //               await sleep(1000)
  //             }
  //             console.log("confirmed send", method.name)
}
