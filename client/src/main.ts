import { Engine } from "@babylonjs/core/Engines/engine"
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"

import { Scene } from "@babylonjs/core/scene"
import { State } from "./types"
import { initCamera } from "./camera"

import("../../pkg/index").then(engine => {})

const canvas = document.getElementById("main") as HTMLCanvasElement

const antialias = true
const baby = new Engine(canvas, antialias)

const initScene = async (state: State): Promise<void> => {
  const [{ createScene }, { initCamera }] = await Promise.all([
    import("./scene"),
    import("./camera"),
  ])
  const scene = createScene(baby)
  initCamera(state, scene).attachControl(canvas)
  baby.runRenderLoop(() => scene.render())
}

initScene({
  camera: {
    position: new Vector3(2, 0, 0),
    target: new Vector3(0, 0, 0),
  },
})

const getState = (scene: Scene): State => {
  const camera = scene.activeCamera as UniversalCamera
  return {
    camera: {
      position: camera.position,
      target: camera.getTarget(),
    },
  }
}

if (module.hot) {
  module.hot.accept("./scene", () => {
    const scene = baby.scenes[0]
    const state = getState(scene)
    scene.dispose()
    initScene(state)
  })
  module.hot.accept("./camera", () => {
    const scene = baby.scenes[0]
    const state = getState(scene)
    scene.activeCamera?.dispose()
    initCamera(state, scene).attachControl(canvas)
  })
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  baby.resize
})
