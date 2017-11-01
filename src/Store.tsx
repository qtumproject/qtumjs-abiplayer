import { computed, observable } from "mobx"

import { Contract, IContractInfo, QtumRPC } from "qtumjs"

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

// FIXME
const rpc = new QtumRPC("http://localhost:9888")

export class Store {
  @observable public ui: IUIState = {}
  @observable public contractsInventoryJSONFile?: File
  @observable.ref public inventory: IContractsInventory = {}
  @observable.ref public modalRenderFunction?: ModalRenderFunction

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
}
