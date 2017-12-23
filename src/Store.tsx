import { autorun, computed, observable, toJS } from "mobx"

import {
  Contract,
  IContractCallRequestOptions,
  IContractCallDecodedResult,
  IDeployedContractInfo,
  IContractSendRequestOptions,
  IContractSendTxConfirmable,
  IContractSendTxReceipt,
  IRPCGetTransactionReceiptResult,
  IRPCGetTransactionResult,

  IRPCSendToContractResult,
  QtumRPC,
} from "qtumjs"

import { IContractsInventory } from "./types"

const NCONFIRM = 3

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
  type: "call"
  contract: IDeployedContractInfo
  method: string
  args: any[]
  result: IContractCallDecodedResult
}

export interface ISendLog {
  type: "send"
  contract: IDeployedContractInfo
  method: string
  args: any[]

  isPendingAuthorization: boolean

  tx?: IRPCGetTransactionResult
  receipt?: IContractSendTxReceipt

  error?: Error
}

export class Store {
  @observable public contractsInventoryJSONFile?: File
  @observable.ref public inventory: IContractsInventory = { contracts: {} }
  @observable.ref public modalRenderFunction?: ModalRenderFunction

  @observable public logs: Array<ICallLog | ISendLog> = []

  constructor() {
    // autorun(() => {
    //   console.log("logs", toJS(this.logs))
    // })
  }

  @computed
  public get contracts(): IDeployedContractInfo[] {
    const contracts = this.inventory.contracts
    return Object.keys(contracts).map((key) => contracts[key])
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

  public rpcCall = async (
    contract: IDeployedContractInfo,
    method: string,
    args: any[],
    opts: IContractCallRequestOptions = {},
  ) => {
    const c = new Contract(rpc, contract)

    const result = await c.call(method, args, opts)

    const calllog: ICallLog = {
      type: "call",
      contract,
      method,
      args,
      result,
    }

    this.logs.unshift(calllog)
  }

  public rpcSend = async (
    contract: IDeployedContractInfo,
    method: string,
    args: any[],
    opts: IContractSendRequestOptions = {},
  ) => {
    const c = new Contract(rpc, contract)

    const sendLog: ISendLog = {
      type: "send",
      contract,
      method,
      args,

      isPendingAuthorization: true,
      tx: undefined,
      receipt: undefined,
    }

    // when added to `logs` (an observable array), `sendlog` will be converted to an observable object
    this.logs.unshift(sendLog)

    // retrieve the mobx observable object
    const log = this.logs[0] as ISendLog

    try {
      const tx = await c.send(method, args, opts)

      log.tx = tx
      log.isPendingAuthorization = false

      tx.confirm(3, (tx_, receipt_) => {
        log.tx = tx_
        log.receipt = receipt_
      })
    } catch (err) {
      log.error = err
      log.isPendingAuthorization = false
    }
  }
}
