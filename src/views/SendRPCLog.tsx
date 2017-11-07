import { observer } from "mobx-react"
import * as React from "react"

import {
  IABIMethod,
  IRPCGetTransactionReceiptResult,
  IRPCGetTransactionResult,
} from "qtumjs"

import * as copy from "copy-to-clipboard"

import { ISendLog } from "../Store"
import { ContractMethodHeader, IContractMethodHeaderTag } from "./partials/ContractMethodHeader"
import { Spinner } from "./Spinner"

const txShowKeys = [
  "confirmations",
  "fee",
  "amount",
]

function ShortenHash(props: {
  hash: string,
  n?: number,
}) {
  const hash = props.hash
  const n = props.n || 3

  if (!hash) {
    return null
  }

  const shorthash = hash.slice(0, n) + "..." + hash.slice(hash.length - n)

  return (
    <a onClick={() => {
      copy(hash)
    }}>
      {shorthash}
      <span className="icon">
        <i className="fa fa-clipboard"></i>
      </span>
    </a>
  )
}

// TODO refactor with functional components

function Receipt(props: {
  receipt: IRPCGetTransactionReceiptResult,
}) {
  const {
    blockNumber,
    gasUsed,
    transactionIndex,
    from,
    log,
  } = props.receipt

  return (
    <div>
      <h4>Receipt</h4>
      <table className="table"><tbody>
        <tr>
          <td>from</td>
          <td>
            <ShortenHash hash={from} n={6} />
          </td>
        </tr>

        <tr>
          <td>block number</td>
          <td>
            {blockNumber}
          </td>
        </tr>

        <tr>
          <td>gas used</td>
          <td>
            {gasUsed}
          </td>
        </tr>

        <tr>
          <td>transaction index</td>
          <td>
            {transactionIndex}
          </td>
        </tr>
      </tbody></table>
    </div>
  )
}

function Inputs(props: {
  args: any[],
  method: IABIMethod,
}) {
  const {
    args,
    method,
  } = props
  return (
    <div>
      <h4>Inputs</h4>
      <table className="table is-bordered">
        <tbody>
          {args.map((val, i) => {
            const {
                    name,
              type,
                  } = method.inputs[i]

            return (
              <tr key={name}>
                <td>{name}</td>
                <td>{type}</td>
                <td className="has-text-right">{val.toString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Tx(props: {
  tx: IRPCGetTransactionResult,
}) {
  const { tx } = props

  const hasOneConfirm = tx && tx.blockhash !== undefined

  return (
    <div>
      <h4>Transaction {!hasOneConfirm && <Spinner />} </h4>
      <table><tbody>
        <tr>
          <td>txid</td>
          <td>
            <ShortenHash hash={tx.txid} n={6} />
          </td>
        </tr>

        {
          tx.blockhash &&
          <tr>
            <td>blockhash</td>
            <td>
              <ShortenHash hash={tx.blockhash} n={6} />
            </td>
          </tr>
        }

        {txShowKeys.map((key) => {
          let val = (tx as any)[key]
          if (val === 0 || val === "") {
            return null
          }

          if (key === "fee" || key === "amount") {
            val = Math.abs(val)
          }

          return (
            <tr key={key}>
              <td>{key}</td>
              <td>{val}</td>
            </tr>
          )
        })}
      </tbody></table>
    </div>
  )
}

@observer
export class SendRPCLog extends React.Component<{
  sendlog: ISendLog,
}, {}> {
  public render() {
    const {
      contract,
      method: methodName,
      args,
      tx,
      txPromise,
      isPendingAuthorization,
      error,
    } = this.props.sendlog

    const receipt = txPromise && txPromise.receipt

    const method = contract.abi.find((abiMethod) => abiMethod.name === methodName)

    if (!method) {
      return <div>method not found</div>
    }

    const hasArgs = method.inputs.length > 0
    // const hasOutputs = result.outputs.length > 0

    const tags: IContractMethodHeaderTag[] = []

    if (isPendingAuthorization) {
      tags.push({
        label: "waiting authorization",
        modifier: "is-warning",
      })
    } else {
      tags.push({
        label: "send",
      })
    }

    if (error) {
      tags.push({
        label: "error",
        modifier: "is-danger",
      })
    }

    return (
      <div className="box content">
        <ContractMethodHeader contract={contract} method={method} tags={tags} />

        {hasArgs && <Inputs args={args} method={method} />}

        {error &&
          <p className="has-text-danger	">{error.message}</p>
        }

        {tx && <Tx tx={tx} />}

        <br />

        {receipt && <Receipt receipt={receipt} />}

        {
          // <code>
          //   <pre>
          //     {JSON.stringify(this.props.sendlog, null, 2)}
          //   </pre>
          // </code>
        }
      </div>
    )
  }
}
