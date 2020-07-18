import * as broker from "./broker"
import { Nullable } from "@babylonjs/core/types"
import { Observer } from "@babylonjs/core/Misc/observable"
import { Scene } from "@babylonjs/core/scene"

let obs: Nullable<Observer<Scene>>

import("../../pkg").then(lib => {
  broker.ready.then(scene => {
    obs = scene.onBeforeRenderObservable.add(({ deltaTime }) => {
      broker.next(lib.rotation(deltaTime))
    })
  })
})

if (module.hot) {
  module.hot.accept()
  module.hot.addDisposeHandler(() => {
    if (obs) obs.unregisterOnNextCall = true
  })
}
