import { computed, observable, toJS } from "mobx"
import { encodeInputs, IABIMethod } from "qtumjs"

export class MethodFormStore {
  @observable public inputs: Map<string, string> = new Map()
  @observable public value: number

  @observable public gasPrice?: number
  @observable public gasLimit?: number
  @observable public sender?: string

  @observable.ref public method: IABIMethod

  @observable public showCalldata = false
  @observable public showSettings = false

  constructor(method: IABIMethod) {
    this.method = method
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
