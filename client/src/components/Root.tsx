import * as React from "react"
import { N } from "../types"
import { pauseService } from "../main"
import { useService } from "@xstate/react"
import styles from "./Root.css"

export const Root: React.FunctionComponent = props => {
  const [state, send] = useService(pauseService)
  const isPaused = state.value === "paused"
  const togglePause = () => send("TOGGLE")
  return (
    <div className={styles.menuBar}>
      <div className={styles.particleCount}>{`N=${N}`}</div>
      <button className={styles.pauseButton} onClick={togglePause}>
        {isPaused ? "unpause" : "pause"}
      </button>
    </div>
  )
}
