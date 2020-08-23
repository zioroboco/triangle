import * as React from "react"
import { N } from "../types"
import { pauseWorker } from "../main"
import styles from "./Root.css"

export const Root: React.FunctionComponent = props => {
  const togglePause = () => pauseWorker.postMessage("TOGGLE")
  return (
    <div className={styles.menuBar}>
      <div className={styles.particleCount}>{`N=${N}`}</div>
      <button className={styles.pauseButton} onClick={togglePause}>
        pause
      </button>
    </div>
  )
}
