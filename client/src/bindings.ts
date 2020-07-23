import * as broker from "./broker"
import { KeyValuePair, curry, range, zip } from "ramda"
import { Nullable } from "@babylonjs/core/types"
import { Observer } from "@babylonjs/core/Misc/observable"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"

const N = 2

let obs: Nullable<Observer<Scene>>
let state: { hot: true } & Nullable<
  Record<"ps" | "vs", KeyValuePair<number, number>[]>
> = module.hot?.data?.state

let engine: typeof import("../../pkg")

import("../../pkg").then(lib => {
  engine = lib
  broker.ready.then(scene => {
    if (state?.hot) {
      range(0, N).map(i => curry(lib.init)(i, ...state!.ps[i], ...state!.vs[i]))
    }
    obs = scene.onBeforeRenderObservable.add(({ deltaTime }) => {
      lib.update(deltaTime)
      const [xs, ys] = [lib.xs(), lib.ys()]
      broker.next({
        positions: range(0, N).map(i => new Vector3(xs[i], 0, ys[i])),
        rotation: lib.rotation(deltaTime),
      })
    })
  })
})

if (module.hot) {
  module.hot.addDisposeHandler(data => {
    if (obs) obs.unregisterOnNextCall = true
    data.state = {
      ps: zip([...engine.xs()], [...engine.ys()]),
      vs: zip([...engine.v_xs()], [...engine.v_ys()]),
      hot: true,
    }
  })
}
