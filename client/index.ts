import { Engine } from "@babylonjs/core/Engines/engine"

import("../pkg/index").then(engine => {})

const canvas = document.getElementById("main") as HTMLCanvasElement

const antialias = true
const engine = new Engine(canvas, antialias)

const initScene = async (): Promise<void> => {
  const { createScene } = await import("./scene")

  const scene = createScene(canvas, engine)

  engine.runRenderLoop(() => {
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
  engine.resize
})
