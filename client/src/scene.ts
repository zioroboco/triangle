import "@babylonjs/core/Materials/standardMaterial"
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color"
import { Engine } from "@babylonjs/core/Engines/engine"
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight"
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder"
import { N, Nullable } from "./types"
import { Observer } from "@babylonjs/core/Misc/observable"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"
import { range } from "ramda"

let obs: Nullable<Observer<Scene>>

export const setupScene = (baby: Engine): Scene => {
  const scene = new Scene(baby)
  scene.clearColor = Color4.FromColor3(Color3.Black())

  new HemisphericLight("light", new Vector3(0, 1, -1), scene)

  const point = MeshBuilder.CreateSphere("point", { diameter: 0.05 }, scene)
  const points = range(0, N).map(i => point.createInstance(i.toString()))
  point.scaling = new Vector3(0, 0, 0)

  import("./broker").then(broker => {
    obs = scene.onBeforeRenderObservable.add(({ deltaTime }) => {
      broker.nextUpdate({ deltaTime })
    })
    broker.worldStream.run(
      {
        event: (_, { positions }) => {
          positions.forEach((p, i) => {
            points[i].position.x = p[0]
            points[i].position.z = p[1]
          })
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
