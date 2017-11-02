import { autorun, toJS } from "mobx"
import { inject, observer } from "mobx-react"

import * as React from "react"

import { Store } from "../Store"
import { CallRPCLog } from "./CallRPCLog"

@inject("store") @observer
export class History extends React.Component<{
  store: Store,
}, {}> {

  public render() {
    const {
      logs,
    } = this.props.store

    return (
      <div>
        {logs.map((log) => {
          return (
            <CallRPCLog calllog={log} />
          )
        })}
      </div>
    )
  }
}
