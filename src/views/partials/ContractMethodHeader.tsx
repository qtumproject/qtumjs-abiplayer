import * as React from "react"
import { IABIMethod, IDeployedContractInfo } from "qtumjs"

import { ShortenHash } from "./ShortenHash"

export interface IContractMethodHeaderTag {
  label: string
  modifier?: string
}

const css = {
  tag: {
    marginRight: "5px",
  },
}

export function ContractMethodHeader(props: {
  contract: IDeployedContractInfo,
  method?: IABIMethod,
  tags?: IContractMethodHeaderTag[],
}) {

  const {
    deployName,
    name: contractName,
    address,
  } = props.contract

  return (
    <div className="content">
      <strong>{contractName}</strong> { props.method && <span className="tag">{props.method.name}</span>}

      {props.tags && props.tags.map((tag) =>
        <span key={tag.label} style={css.tag} className={`tag is-pulled-right ${tag.modifier || ""}`}>
          {tag.label}
        </span>)}

      <br />
      <span className="is-size-7">
        {deployName} <span className="fa fa-long-arrow-right" /> <ShortenHash hash={address}/>
      </span>
    </div>
  )
}
