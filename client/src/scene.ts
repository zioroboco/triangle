import "@babylonjs/core/Materials/standardMaterial"
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color"
import { DIM_N, DIM_X, DIM_Y, N } from "./types"
import { Engine } from "@babylonjs/core/Engines/engine"
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight"
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"
import { range } from "ramda"

export const setupScene = (baby: Engine): Scene => {
  const scene = new Scene(baby)
  scene.clearColor = Color4.FromColor3(Color3.Black())

  new HemisphericLight("light", new Vector3(0, 1, -1), scene)

  const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 0.05 }, scene)

  const spheres = range(0, N).map(i => sphere.createInstance(i.toString()))

  import("./broker").then(({ stream, init }) => {
    const scheduler = init(scene)
    stream.run(
      {
        event: (_, { positions }) => {
          positions.forEach((p, i) => {
            spheres[i].position.x = p[0]
            spheres[i].position.z = p[1]
          })
        },
        end: () => {},
        error: () => {},
      },
      scheduler
    )
  })

  return scene
}
