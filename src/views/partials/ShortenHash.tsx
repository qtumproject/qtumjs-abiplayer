import * as React from "react"

import * as copy from "copy-to-clipboard"

export function ShortenHash(props: {
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
