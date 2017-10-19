import * as React from "react"

const devContracts = require("../../solar.development.json")

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

  private renderContract(contract: IContract) {
    const methods = contract.abi.filter((method: any) => method.name !== "")

    if (methods.length === 0) {
      return "contract has no method"
    }

    const inputFields = methods.map((method: any) => {
      const {
        name,
        inputs,
      } = method

      return inputs.map((arg: any) => {
        return (
          <p key={arg.name}>
            <label>{arg.name}</label>
            <input />
          </p>
        )
      })
    })

    return (
      <div>
        <h3> {contract.deployName} ({contract.name}) </h3>
        {inputFields}

        <button>Call</button>

        <button>Send</button>
      </div>
    )
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
