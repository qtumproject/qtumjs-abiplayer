import * as React from "react"

export function MethodForm(props: {}) {
  return (
    <div className="box content">
      <p>
        <strong>deployName</strong> contractName methodName
        <span className="tag is-success is-pulled-right">
          payable
        </span>
        <br />
        <span className="is-size-7">2aea57add1e44e5933ebf1f6ee8ce5fb14951ac089e04fc06246d485e20fd322</span>
      </p>

      <div>
        <div className="field">
          <label className="label">Value</label>
          <div className="control">
            <input className="input" type="text" placeholder="0" />
          </div>
        </div>

        <div className="field">
          <label className="label">A <span className="is-pulled-right has-text-grey-light">uint256</span></label>
          <div className="control">
            <input className="input" type="text" placeholder="0" />
          </div>
        </div>

        <p>
          <a href="#">Preview Call Data</a>
        </p>

        <hr />

        <p>
          <span className="is-pulled-right is-size-7">
            Free read-only computation
          </span>
          <a className="button is-medium is-fullwidth">Call</a>
        </p>

        <p>
          <span className="is-pulled-right is-size-7">
            Create a transaction for global consensus
          </span>
          <a className="button is-medium is-success is-fullwidth">Send</a>
        </p>

      </div>
    </div>
  )
}
