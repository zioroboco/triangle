import "@babylonjs/core/Materials/standardMaterial"
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color"
import { Engine } from "@babylonjs/core/Engines/engine"
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight"
import { N, Nullable } from "./types"
import { Observer } from "@babylonjs/core/Misc/observable"
import { PointsCloudSystem } from "@babylonjs/core"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"

let obs: Nullable<Observer<Scene>>

export const setupScene = (baby: Engine): Scene => {
  const scene = new Scene(baby)
  scene.useRightHandedSystem = true
  scene.clearColor = Color4.FromColor3(Color3.Black())

  new HemisphericLight("light", new Vector3(0, 1, -1), scene)

  const cloud = new PointsCloudSystem("points", 1, scene, { updatable: true })
  cloud.addPoints(N)
  cloud.buildMeshAsync()

  import("./broker").then(broker => {
    obs = scene.onBeforeRenderObservable.add(({ deltaTime }) => {
      broker.nextUpdate({ deltaTime })
    })
    broker.worldStream.run(
      {
        event: (_, { positions }) => {
          positions.forEach((p, i) => {
            cloud.particles[i].position = p
          })
          cloud.setParticles()
        },
        end: () => {},
        error: () => {},
      },
      broker.scheduler
    )
  })

  return scene
}

if (module.hot) {
  module.hot.addDisposeHandler(() => {
    if (obs) obs.unregisterOnNextCall = true
  })
}
