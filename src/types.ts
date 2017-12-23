import { IDeployedContractInfo } from "qtumjs"

export interface IContractsInventory {
  contracts: { [key: string]: IDeployedContractInfo }
}
