import "./bindings"
import * as subject from "most-subject"
import { Scene } from "@babylonjs/core/scene"
import { World } from "./types"
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

export const [sink, stream] = subject.create<World>()

export const next = (w: World) => {
  subject.event(currentTime(scheduler), w, sink)
}
