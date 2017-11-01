import { computed, observable } from "mobx"

export class MethodFormStore {
  // @observable public inputs: { [key: string]: string } = {}

  @observable public inputs: Map<string, string> = new Map()

  public updateInput(name: string, value: string) {
    this.inputs.set(name, value)
    // this.inputs[name] = value
  }
}
