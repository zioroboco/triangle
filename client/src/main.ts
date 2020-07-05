import { Engine } from "@babylonjs/core/Engines/engine"
import { Scene } from "@babylonjs/core/scene"

import("../../pkg/index").then(engine => {})

const canvas = document.getElementById("main") as HTMLCanvasElement

const antialias = true
const baby = new Engine(canvas, antialias)

let scene: Scene | undefined

const initScene = async (): Promise<void> => {
  const { createScene } = await import("./scene")

  scene = createScene(canvas, baby)

  baby.runRenderLoop(() => {
    if (!scene) {
      throw new Error(`attempted to render scene with value: ${scene}`)
    }

    scene.render()
  })
}

if (module.hot) {
  module.hot.accept(["./scene"], () => {
    initScene()
  })
}

initScene()

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  baby.resize
})
