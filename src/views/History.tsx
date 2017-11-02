import { inject, observer } from "mobx-react"

import * as React from "react"

import { Store } from "../Store"
import { CallRPCLog } from "./CallRPCLog"
import { SendRPCLog } from "./SendRPCLog"

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
        {logs.map((log, i) => {
          if (log.type === "call") {
            return (
              <CallRPCLog key={i} calllog={log} />
            )
          } else if (log.type === "send") {
            return (
              <SendRPCLog key={i} sendlog={log} />
            )
          }
        })}
      </div>
    )
  }
}
