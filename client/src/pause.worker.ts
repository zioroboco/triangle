/// <reference lib="webworker" />

import { interpret } from "xstate"
import { pauseMachine } from "./machine"

const worker: DedicatedWorkerGlobalScope = self as any

const pauseService = interpret(pauseMachine, { devTools: true })
pauseService.start()

onmessage = event => {
  pauseService.send(event.data)
  worker.postMessage(pauseService.state.value)
}

export default class extends Worker {
  constructor() {
    super("pause")
  }
}
