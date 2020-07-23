import * as broker from "./broker"
import { Nullable } from "@babylonjs/core/types"
import { Observer } from "@babylonjs/core/Misc/observable"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"

let obs: Nullable<Observer<Scene>>

import("../../pkg").then(lib => {
  broker.ready.then(scene => {
    obs = scene.onBeforeRenderObservable.add(({ deltaTime }) => {
      lib.update(deltaTime)
      const [xs, ys] = [lib.xs(), lib.ys()]
      broker.next({
        positions: [0, 1].map(i => new Vector3(xs[i], 0.5, ys[i])),
        rotation: lib.rotation(deltaTime),
      })
    })
  })
})

if (module.hot) {
  module.hot.accept()
  module.hot.addDisposeHandler(() => {
    if (obs) obs.unregisterOnNextCall = true
  })
}
