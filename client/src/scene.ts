import "@babylonjs/core/Materials/standardMaterial"
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color"
import { Engine } from "@babylonjs/core/Engines/engine"
import { FlyCamera } from "@babylonjs/core/Cameras/flyCamera"
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight"
import { Mesh } from "@babylonjs/core/Meshes/mesh"
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"

export const createScene = (
  canvas: HTMLCanvasElement,
  engine: Engine
): Scene => {
  const scene = new Scene(engine)
  scene.clearColor = Color4.FromColor3(Color3.Black())

  const camera = new FlyCamera("camera", new Vector3(2, 0, 0), scene)
  camera.setTarget(new Vector3(0, 0, 0))
  camera.attachControl(canvas, true)
  camera.speed = 0.2

  const light: HemisphericLight = new HemisphericLight(
    "light",
    new Vector3(1, 1, 0),
    scene
  )

  const sphere: Mesh = MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 1 },
    scene
  )

  return scene
}
