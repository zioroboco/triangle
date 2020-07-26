import * as broker from "./broker"
import { DIM_N, DIM_X, DIM_Y, N } from "./types"
import { KeyValuePair, range } from "ramda"
import { Nullable } from "@babylonjs/core/types"
import { Observer } from "@babylonjs/core/Misc/observable"
import { Scene } from "@babylonjs/core/scene"
import arrangement from "./arrangements"

let obs: Nullable<Observer<Scene>>
let state: { hot: true } & Nullable<Record<"ps" | "vs", Float64Array>> =
  module.hot?.data?.state

let engine: import("../../pkg").State

import("../../pkg").then(({ State: Engine }) => {
  broker.ready.then(scene => {
    engine?.free()
    engine = state?.hot
      ? Engine.init(state.ps, state.vs)
      : Engine.init(...arrangement())

    obs = scene.onBeforeRenderObservable.add(({ deltaTime }) => {
      engine.update(deltaTime)
      const ps = engine.positions()
      broker.next({
        positions: range(0, N).map(i => [
          ps[i * DIM_N + DIM_X],
          ps[i * DIM_N + DIM_Y],
        ]),
      })
    })
  })
})

if (module.hot) {
  module.hot.addDisposeHandler(data => {
    if (obs) obs.unregisterOnNextCall = true
    data.state = {
      ps: engine.positions(),
      vs: engine.velocities(),
      hot: true,
    }
  })
}
