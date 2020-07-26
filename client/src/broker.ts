import "./bindings"
import * as subject from "most-subject"
import { Update, World } from "./types"
import { currentTime, newDefaultScheduler } from "@most/scheduler"

export const scheduler = newDefaultScheduler()

export const [worldSink, worldStream] = subject.create<World>()
export const nextWorld = (w: World) => {
  subject.event(currentTime(scheduler), w, worldSink)
}

export const [updateSink, updateStream] = subject.create<Update>()
export const nextUpdate = (u: Update) => {
  subject.event(currentTime(scheduler), u, updateSink)
}
