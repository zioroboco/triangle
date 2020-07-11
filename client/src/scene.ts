import "@babylonjs/core/Materials/standardMaterial"
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color"
import { Engine } from "@babylonjs/core/Engines/engine"
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight"
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"

export const setupScene = (baby: Engine): Scene => {
  const scene = new Scene(baby)
  scene.clearColor = Color4.FromColor3(Color3.Black())

  new HemisphericLight("light", new Vector3(0, 1, -1), scene)

  const poly = MeshBuilder.CreateDisc("poly", { tessellation: 3 }, scene)
  poly.rotate(Vector3.Forward(), Math.PI / 2)

  return scene
}
