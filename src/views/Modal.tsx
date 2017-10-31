import { inject, observer } from "mobx-react"
import * as React from "react"

import { Store } from "../Store"

@inject("store") @observer
export class Modal extends React.Component<{ store: Store }, {}> {
  public render() {
    const {
      modalRenderFunction,
    } = this.props.store

    if (modalRenderFunction === undefined) {
      return null
    }

    return (
      <div className="modal is-active">
        <div className="modal-background"
          onClick={this.props.store.hideModal}></div>
        <div className="modal-content">
          {modalRenderFunction()}
        </div>
        <button className="modal-close is-large" aria-label="close"
          onClick={this.props.store.hideModal} />
      </div>
    )
  }
}
