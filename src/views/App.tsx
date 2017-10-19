import { Contract, QtumRPC } from "qtumjs"
import * as React from "react"

const rpc = new QtumRPC("http://localhost:9888")
// const devContracts = require("../../solar.development.json")
const devContracts = {}

interface IState {
  contracts: IContractsMap
  selectedContract?: IContract
}

// tslint:disable-next-line:no-empty-interface
interface IProp { }

interface IContract {
  name: string
  deployName: string
  address: string
  abi: any
}

interface IContractsMap {
  [key: string]: IContract
}

export class App extends React.Component<IProp, IState> {
  constructor(props: IProp) {
    super(props)

    this.state = {
      contracts: devContracts,
    }
  }

  public render() {
    const {
      contracts,
      selectedContract,
    } = this.state
    return (
      <div>
        <div className="filedropper"
          onDragOver={this.onDragOver.bind(this)}
          onDrop={this.onDrop.bind(this)}>

          <input type="file" onChange={this.onFileInputChange} />
        </div>

        <div>
          {this.renderContracts(contracts)}
        </div>

        {selectedContract && this.renderContract(selectedContract)}
      </div>
    )
  }

  private quickConfirm = () => {
    rpc.rawCall("")
  }

  private renderContract(contract: IContract) {
    const methods = contract.abi.filter((method: any) => method.name !== "")

    const qContract = new Contract(rpc, contract)

    if (methods.length === 0) {
      return "contract has no method"
    }

    const methodForms = methods.map((method: any) => {
      const {
        name,
        inputs,
      } = method

      const params: any[] = []

      let i = 0
      const inputFields = inputs.map((arg: any) => {
        i++
        const j = i - 1
        return (
          <p key={arg.name}>
            <label>{arg.name}</label>
            <input onChange={(e) => {
              params[j] = e.target.value
            }} />
          </p>
        )
      })

      return (
        <div style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
          <h3>{method.name}</h3>
          {inputFields}
          <button onClick={async () => {
            const calldata = qContract.encodeParams(method.name, params)

            console.log("call", method.name, params)
            console.log("abi call data", calldata)

            const result = await qContract.call(method.name, params)

            console.log("result", result)
          }}>Call</button>
          {!method.constant &&
            <button onClick={async () => {
              const calldata = qContract.encodeParams(method.name, params)
              console.log("send", method.name, params)
              console.log("abi call data", calldata)

              const receipt = await qContract.send(method.name, params)
              console.log("txid", receipt.txid)
              while (true) {
                console.log("check confirmation")
                if (await receipt.check(1)) {
                  break
                }

                await sleep(1000)
              }
              console.log("confirmed send", method.name)
            }}>Send</button>
          }
        </div>
      )
    })

    return (
      <div>
        <h2> {contract.deployName} ({contract.name}) </h2>
        {methodForms}
      </div>
    )
  }

  private onInputChange(i: number, e: any) {
    const value = e.target.value

    const params = this.state.params.slice(0)
    params[i] = value
    this.setState({
      params,
    })
  }

  private renderContracts(contracts: IContractsMap) {
    return (
      <ul>
        {Object.keys(contracts).map((key) => {
          const contract = contracts[key]
          const {
            name,
            deployName,
            address,
          } = contract
          return (
            <li key={key}>
              <a href="#" onClick={() => this.chooseContract(contract)}>
                {deployName} ({name}) => {address}
              </a>
            </li>
          )
        })}
      </ul>
    )
  }

  private chooseContract = (contract: IContract) => {
    this.setState({
      selectedContract: contract,
    })
  }

  private onFileInputChange = async (e: any) => {
    const files: FileList = e.target.files
    const content = await readFile(files[0])
    this.setState({
      contracts: JSON.parse(content),
    })
  }

  private onDragOver(e: any) {
    e.preventDefault()
  }

  private async onDrop(e: DragEvent) {
    e.preventDefault()

    // console.log("drop", e)

    const files = e.dataTransfer.files
    const f = files[0]
    console.log("open", f.name)

    const content = await readFile(f)
    this.setState({
      contracts: JSON.parse(content),
    })


  }
}

async function readFile(f: File): Promise<string> {
  // TODO handle error
  const r = new FileReader()
  const p = new Promise<string>((resolve) => {
    r.addEventListener("loadend", (e) => {
      // resolve(e.target.)
      resolve(r.result)
    })

    r.addEventListener("error", (e) => {
      console.log("read error", e)
    })
  })
  r.readAsText(f)

  return p
}

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
