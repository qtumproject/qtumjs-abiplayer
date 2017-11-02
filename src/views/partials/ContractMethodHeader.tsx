import * as React from "react"

import { IABIMethod, IContractInfo } from "qtumjs"

export interface ITag {
  label: string
  modifier?: string
}

export function ContractMethodHeader(props: {
  contract: IContractInfo,
  method: IABIMethod,
  tags?: ITag[],
}) {

  const {
    deployName,
    name: contractName,
    address,
  } = props.contract

  const {
    name: methodName,
    payable,
    constant,
  } = props.method

  return (
    <div className="content">
      <strong>{deployName}</strong> {contractName} <span className="tag">{methodName}</span>

      {props.tags && props.tags.map((tag) =>
        <span key={tag.label} className={`tag is-pulled-right ${tag.modifier || ""}`}>
          {tag.label}
        </span>)}

      <br />
      <span className="is-size-7">{address}</span>
    </div>
  )
}