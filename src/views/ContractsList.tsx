import { inject, observer } from "mobx-react"
import { IABIMethod } from "qtumjs"
import * as React from "react"

import { Store } from "../Store"
import { ContractItem } from "./ContractItem"

@inject("store") @observer
export class ContractsList extends React.Component<{ store: Store }, {}> {
  public render() {
    const {
      contracts,
      showModal,
    } = this.props.store

    return (
      <div>
        {
          contracts.map((contract) => <ContractItem
            key={contract.deployName}
            contract={contract}
            store={this.props.store} />)
        }
      </div>
    )
  }

}
