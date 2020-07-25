import * as broker from "./broker"
import { KeyValuePair, curry, range, zip } from "ramda"
import { Nullable } from "@babylonjs/core/types"
import { Observer } from "@babylonjs/core/Misc/observable"
import { Scene } from "@babylonjs/core/scene"

let obs: Nullable<Observer<Scene>>
let state: { hot: true } & Nullable<
  Record<"ps" | "vs", KeyValuePair<number, number>[]>
> = module.hot?.data?.state

let engine: typeof import("../../pkg")

import("../../pkg").then(lib => {
  engine = lib
  const N: number = lib.size()
  broker.ready.then(scene => {
    const init = curry(lib.init)
    if (state?.hot) {
      range(0, N).map(i => init(i, ...state!.ps[i], ...state!.vs[i]))
    } else {
      range(0, N).map(i => init(i, ...random2(3), ...random2(2)))
    }
    obs = scene.onBeforeRenderObservable.add(({ deltaTime }) => {
      lib.update(deltaTime)
      const [xs, ys] = [lib.xs(), lib.ys()]
      broker.next({
        positions: range(0, N).map(i => [xs[i], ys[i]]),
      })
    })
  })
})

const random2 = (max: number) =>
  [Math.random(), Math.random()].map(x => x * 2 * max - max)

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
