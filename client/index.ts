import { Engine } from "@babylonjs/core/Engines/engine"

import("../pkg/index").then(engine => {})

const init = async (canvas: HTMLCanvasElement): Promise<void> => {
  const { createScene } = await import("./scene")

  const antialias = true
  const engine = new Engine(canvas, antialias)

  const scene = createScene(canvas, engine)

  engine.runRenderLoop(() => {
    scene.render()
  })

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    engine.resize
  })
}

const canvas = document.getElementById("main") as HTMLCanvasElement

init(canvas)
