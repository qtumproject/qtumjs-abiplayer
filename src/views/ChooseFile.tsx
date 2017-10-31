import { inject, observer } from "mobx-react"
import * as React from "react"

import { Store } from "../store"

@inject("store") @observer
export class ChooseFile extends React.Component<{ store: Store }, {}> {
  public render() {
    const {
      contractsInventoryJSONFile,
    } = this.props.store
    // KeyboardEvent
    const fileName = contractsInventoryJSONFile ? contractsInventoryJSONFile.name : "no file selected"
    return (
      <div className="file has-name is-fullwidth">
        <label className="file-label">
          <input className="file-input" type="file" name="resume"
            onChange={(e) => {
              if (e.target.files) {
                this.selectFile(e.target.files)
              }
            }}
          />

          <span className="file-cta">
            <span className="file-icon">
              <i className="fa fa-upload"></i>
            </span>
            <span className="file-label">
              Choose a file…
          </span>
          </span>
          <span className="file-name">
            {fileName}
          </span>
        </label>
      </div>
    )
  }

  private async selectFile(files: FileList) {
    const file = files[0]
    this.props.store.useContractsInventoryJSONFile(file)
    // file.name
  }

}
