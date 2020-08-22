import * as React from "react"
import { N } from "../types"
import { pauseService } from "../main"
import { useService } from "@xstate/react"
import $ from "./Root.css"

export const Root: React.FunctionComponent = props => {
  const [state, send] = useService(pauseService)
  const isPaused = state.value === "paused"
  const togglePause = () => send("TOGGLE")
  return (
    <div className={$.menuBar}>
      <div className={$.particleCount}>{`N=${N}`}</div>
      <button className={$.pauseButton} onClick={togglePause}>
        {isPaused ? "unpause" : "pause"}
      </button>
    </div>
  )
}
