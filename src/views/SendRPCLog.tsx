import { observer } from "mobx-react"
import * as React from "react"

import {
  IABIMethod,
  IDecodedLog,
  IRPCGetTransactionReceiptResult,
  IRPCGetTransactionResult,
  IContractSendTxReceipt,
} from "qtumjs"

import * as copy from "copy-to-clipboard"

import { ISendLog } from "../Store"
import { ContractMethodHeader, IContractMethodHeaderTag } from "./partials/ContractMethodHeader"
import { Spinner } from "./Spinner"
import { ShortenHash } from "./partials/ShortenHash";

const txShowKeys = [
  "confirmations",
  "fee",
  "amount",
]

function Receipt(props: {
  receipt: IContractSendTxReceipt,
}) {
  const {
    blockNumber,
    gasUsed,
    transactionIndex,
    from,
    logs,
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
  tx?: IRPCGetTransactionResult,
}) {
  if (!props.tx) {
    return (
      <div>
        <h4>Transaction</h4>
        <Spinner />
      </div>
    )
  }

  const tx = props.tx

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

function LogItem(props: {
  log: IDecodedLog,
  method: IABIMethod,
}) {
  const {
    log,
    method,
  } = props

  const {
    type,
  } = log

  return (
    <table className="table is-bordered"><tbody>
      <tr>
        <td>type</td>
        <td colSpan={2}>{type}</td>
      </tr>

      {Object.keys(log).map((key) => {
        if (key === "type") {
          return null
        }

        const input = method.inputs.find((_input) => _input.name === key)!

        let val = log[key]

        // if (val instanceof BN) {
        // check for BN... instanceof doesn't work (different version of npm required here?)
        if (val.toNumber) {
          val = val.toNumber()
        }

        return (
          <tr key={key}>
            <td>{key}</td>
            <td>{input.type}</td>
            <td>{val}</td>
          </tr>
        )
      })}
    </tbody></table>
  )
}

function DecodedLogs(props: {
  logs: IDecodedLog[],
  methods: IABIMethod[],
}) {
  const {
    logs,
    methods,
  } = props
  return (
    <div>
      <h4>Event Logs</h4>
      {logs.map((log, i) => {
        const eventABI = methods.find((method) => method.name === log.type)!
        return <LogItem key={i} log={log} method={eventABI} />
      })}
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
      receipt,
      tx,

      isPendingAuthorization,
      error,
    } = this.props.sendlog

    const logs = receipt && receipt.logs

    const method = contract.abi.find((_method) => _method.name === methodName)

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

        <Tx tx={tx} />

        <br />

        {receipt && <Receipt receipt={receipt} />}

        {logs && logs.length > 0 &&
          <DecodedLogs logs={logs} methods={contract.abi} />
        }

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
