import * as React from "react"
import { N } from "../types"
import { pauseWorker } from "../main"
import $ from "./Root.css"

export const Root: React.FunctionComponent = props => {
  const togglePause = () => pauseWorker.postMessage("TOGGLE")
  return (
    <div className={$.menuBar}>
      <div className={$.particleCount}>{`N=${N}`}</div>
      <button className={$.pauseButton} onClick={togglePause}>
        pause
      </button>
    </div>
  )
}
