import "@babylonjs/core/Materials/standardMaterial"
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color"
import { DIM_X, DIM_Y, N, Nullable } from "./types"
import { Engine } from "@babylonjs/core/Engines/engine"
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight"
import { LinesMesh } from "@babylonjs/core/Meshes/linesMesh"
import { Mesh } from "@babylonjs/core/Meshes/mesh"
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder"
import { Observer } from "@babylonjs/core/Misc/observable"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"
import { range } from "ramda"

let obs: Nullable<Observer<Scene>>

export const setupScene = (baby: Engine): Scene => {
  const scene = new Scene(baby)
  scene.clearColor = Color4.FromColor3(Color3.Black())

  new HemisphericLight("light", new Vector3(0, 1, -1), scene)

  const body = MeshBuilder.CreateSphere("point", { diameter: 0.05 }, scene)
  const bodies = range(0, N).map(i => body.createInstance(i.toString()))
  // body.scaling = new Vector3(0, 0, 0)

  const points: Vector3[][] = range(0, N).map(() => [])

  import("./broker").then(broker => {
    obs = scene.onBeforeRenderObservable.add(({ deltaTime }) => {
      broker.nextUpdate({ deltaTime })
    })
    broker.worldStream.run(
      {
        event: (_, { positions }) => {
          positions.forEach((p, i) => {
            if (scene.getFrameId() % 20) {
              const k = points[i].push(new Vector3(p[DIM_X], 0, p[DIM_Y]))
              if (k >= 2) {
                MeshBuilder.CreateLines("", {
                  points: [points[i][k - 1], points[i][k - 2]],
                })
              }
            }
            bodies[i].position.x = p[DIM_X]
            bodies[i].position.z = p[DIM_Y]
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
