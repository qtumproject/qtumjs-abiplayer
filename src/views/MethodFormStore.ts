import { computed, observable, toJS } from "mobx"
import {
  encodeInputs,
  IABIMethod,
  IContractSendRequestOptions,
  IContractCallRequestOptions,
  IDeployedContractInfo,
 } from "qtumjs"

export class MethodFormStore {
  @observable public inputs: Map<string, string> = new Map()
  @observable public value: number

  @observable public gasPrice?: number
  @observable public gasLimit?: number
  @observable public sender?: string

  // @observable.ref public method: IABIMethod
  @observable public showCalldata = false
  @observable public showSettings = false

  constructor(
    public info: IDeployedContractInfo,
    public method: IABIMethod,
  ) {
  }

  public updateInput(name: string, value?: string) {
    if (value) {
      this.inputs.set(name, value)
    } else {
      this.inputs.delete(name)
    }
  }

  public toggleCalldata = () => {
    this.showCalldata = !this.showCalldata
  }

  /**
   * senderAddress returns the address specified in the form, or the contract's
   * owner address (if available).
   */
  @computed
  public get senderAddress(): string | undefined {
    const {
      sender,
    } = this

    if (sender && sender !== "") {
      return sender
    } else {
      return this.info.sender
    }
  }

  @computed
  public get callOptions(): IContractCallRequestOptions {
    const opts: IContractCallRequestOptions = {}

    const sender = this.senderAddress

    if (this.senderAddress) {
      opts.senderAddress = this.senderAddress
    }

    return opts
  }

  @computed
  public get sendOptions(): IContractSendRequestOptions {
    const opts: IContractSendRequestOptions = {}

    const {
      value,
      gasLimit,
      gasPrice,
    } = this

    if (this.method.payable && value > 0) {
      opts.amount = value
    }

    if (gasLimit && gasLimit > 0) {
      opts.gasLimit = gasLimit
    }

    if (gasPrice && gasPrice > 0) {
      opts.gasPrice = gasPrice
    }

    if (this.senderAddress) {
      opts.senderAddress = this.senderAddress
    }

    return opts
  }

  @computed
  public get encodedABIcalldata(): string {
    return encodeInputs(this.method, toJS(this.paramValues))
  }

  @computed
  public get calldataEncodeError(): Error | undefined {
    try {
      encodeInputs(this.method, toJS(this.paramValues))
      return undefined
    } catch (error) {
      return error
    }
  }

  public get paramValues(): string[] {
    return this.method.inputs.map((input) => {
      const val = this.inputs.get(input.name)
      if (val === undefined) {
        throw new Error(`${input.name} cannot be empty`)
      }

      return val
    })
  }
}
