import "./bindings"
import * as subject from "most-subject"
import { Scene } from "@babylonjs/core/scene"
import { currentTime, newDefaultScheduler } from "@most/scheduler"

export const scheduler = newDefaultScheduler()

let resolveScene: (value: Scene) => void
export const ready = new Promise<Scene>((resolve, _) => {
  resolveScene = resolve
})

export const init = (scene: Scene) => {
  resolveScene(scene)
  return scheduler
}

export const [sink, stream] = subject.create<number>()

export const next = (n: number) => {
  subject.event(currentTime(scheduler), n, sink)
}
