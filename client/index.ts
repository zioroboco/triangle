import {
  Color3,
  Color4,
  Engine,
  FlyCamera,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  Vector3,
} from "babylonjs"

const canvas = document.createElement("canvas")

document.body.appendChild(canvas)

const antialiasEnabled = true

const engine = new Engine(canvas, antialiasEnabled)

const createScene = (): Scene => {
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

const scene = createScene()

engine.runRenderLoop(() => {
  scene.render()
})

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  engine.resize
})

import("../pkg/index").then(engine => {})

export default {}
