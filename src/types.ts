import { IABIMethod } from "qtumjs"

export interface IContract {
  name: string
  deployName: string
  address: string
  abi: IABIMethod[]
}

export interface IContractsInventory {
  [key: string]: IContract
}
