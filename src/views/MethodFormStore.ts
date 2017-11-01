import { computed, observable, toJS } from "mobx"
import { encodeInputs, IABIMethod } from "qtumjs"

export class MethodFormStore {
  @observable public showCalldataPreview = false
  @observable public inputs: Map<string, string> = new Map()
  @observable.ref public method: IABIMethod

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

  public toggleCalldataPreview = () => {
    this.showCalldataPreview = !this.showCalldataPreview
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
