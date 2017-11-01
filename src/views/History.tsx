import { autorun, toJS } from "mobx"
import { inject, observer } from "mobx-react"

import * as React from "react"

import { Store } from "../Store"

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
        <div className="box">
          {logs.map((log) => {
            const {
              method,
            } = log
            return (
              <div>
                Call {method}

                <pre><code>
                  {JSON.stringify(toJS(log), null, 2)}
                </code></pre>
              </div>
            )

          })}
        </div>
      </div>
    )
  }
}
