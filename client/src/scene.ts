import "@babylonjs/core/Materials/standardMaterial"
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color"
import { Engine } from "@babylonjs/core/Engines/engine"
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight"
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector"
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder"
import { Scene } from "@babylonjs/core/scene"

export const setupScene = (baby: Engine): Scene => {
  const scene = new Scene(baby)
  scene.clearColor = Color4.FromColor3(Color3.Black())

  new HemisphericLight("light", new Vector3(1, 1, 0), scene)

  const rotation = Matrix.RotationAxis(Vector3.Right(), (2 * Math.PI) / 3)
  const points: Vector3[] = [
    Vector3.Up(),
    Vector3.TransformCoordinates(Vector3.Up(), rotation),
    Vector3.TransformCoordinates(Vector3.Up(), rotation.invert()),
    Vector3.Up(),
  ]

  MeshBuilder.CreateLines("lines", { points }, scene)

  MeshBuilder.CreateDisc("poly", { tessellation: 3 }, scene)
    .rotate(Vector3.Up(), -Math.PI / 2)
    .rotate(Vector3.Forward(), -Math.PI / 2)

  return scene
}
