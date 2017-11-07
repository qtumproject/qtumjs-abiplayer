import { autorun, computed, observable, toJS } from "mobx"

import {
  ConfirmedTransaction,
  Contract,
  IContractCallDecodedResult,
  IContractInfo,
  IContractSendRequestOptions,
  IRPCGetTransactionReceiptResult,
  IRPCGetTransactionResult,
  IRPCSendToContractResult,
  QtumRPC,
  TransactionPromise,
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
  contract: IContractInfo
  method: string
  args: any[]
  result: IContractCallDecodedResult
}

export interface ISendLog {
  type: "send"
  // 1. req sent to authorization RPC proxy, pending authorization
  isPendingAuthorization: boolean

  txPromise: TransactionPromise

  // 2. transaction confirmed
  tx?: ConfirmedTransaction

  error?: Error
}

export class Store {
  @observable public contractsInventoryJSONFile?: File
  @observable.ref public inventory: IContractsInventory = {}
  @observable.ref public modalRenderFunction?: ModalRenderFunction

  @observable public logs: Array<ICallLog | ISendLog> = []

  constructor() {
    autorun(() => {
      console.log("logs", toJS(this.logs))
    })

    this.logs.push(require("../example.sendlog.json"))
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

  public rpcCall = async (
    contract: IContractInfo,
    method: string,
    args: any[],
  ) => {
    const c = new Contract(rpc, contract)

    const result = await c.call(method, args)

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
    contract: IContractInfo,
    method: string,
    args: any[],
    opts: IContractSendRequestOptions = {},
  ) => {
    const c = new Contract(rpc, contract)

    const txPromise = c.send(method, args, opts)

    const sendLog: ISendLog = {
      type: "send",
      isPendingAuthorization: true,
      txPromise,

      // tx is set when transaction had been confirmed
      tx: undefined,
    }

    // when added to `logs` (an observable array), `sendlog` will be converted to an observable object
    this.logs.unshift(sendLog)

    // retrieve the mobx observable object
    const log = this.logs[0] as ISendLog

    try {
      await txPromise.exec()

      log.isPendingAuthorization = false

      await txPromise.confirm(NCONFIRM, 3000, (newTx) => {
        log.tx = newTx
      })
    } catch (err) {
      log.error = err
      log.isPendingAuthorization = false
    }
  }
}
