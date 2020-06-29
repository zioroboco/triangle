import {
  ArcRotateCamera,
  Color3,
  Color4,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  Vector3,
} from "babylonjs"

const canvas = document.createElement("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

document.body.appendChild(canvas)

const antialiasEnabled = true

const engine = new Engine(canvas, antialiasEnabled)

const createScene = (): Scene => {
  const scene = new Scene(engine)
  scene.clearColor = Color4.FromColor3(Color3.Black())

  const camera = new ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 2,
    2,
    Vector3.Zero(),
    scene
  )

  var light: HemisphericLight = new HemisphericLight(
    "light",
    new Vector3(1, 1, 0),
    scene
  )

  var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene)

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

import("../pkg").then(engine => {})
