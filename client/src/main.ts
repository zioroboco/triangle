import { Engine } from "@babylonjs/core/Engines/engine"
import { Nullable } from "@babylonjs/core/types"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"

import { State } from "./types"
import { setupCamera } from "./camera"

import("../../pkg/index").then(engine => {})

const canvas = document.getElementById("main") as HTMLCanvasElement

const antialias = true
const baby = new Engine(canvas, antialias)

let scene: Nullable<Scene> = null

const init = (state: State): Promise<void> =>
  Promise.all([import("./scene"), import("./camera")]).then(
    ([{ setupScene }, { setupCamera }]) => {
      scene = setupScene(baby)
      setupCamera(state, scene).attachControl(canvas)
      baby.runRenderLoop(() => scene!.render())
    }
  )

const getState = (scene: Scene): State => {
  const camera = scene.activeCamera as ReturnType<typeof setupCamera>
  return {
    camera: {
      position: camera.position,
      target: camera.getTarget(),
    },
  }
}

init({
  camera: {
    position: new Vector3(2, 0, 0),
    target: new Vector3(0, 0, 0),
  },
})

if (module.hot) {
  module.hot.accept("./scene", () => {
    const state = getState(scene!)
    scene!.dispose()
    init(state)
  })
  module.hot.accept("./camera", () => {
    const state = getState(scene!)
    scene!.activeCamera!.dispose()
    setupCamera(state, scene!).attachControl(canvas)
  })
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  baby.resize
})
