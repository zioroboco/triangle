import "@babylonjs/inspector"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Engine } from "@babylonjs/core/Engines/engine"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"
import { codes } from "keycode"

import { CameraType, setupCamera } from "./camera"
import { Nullable, State } from "./types"
import { setupScene } from "./scene"
import Root from "./components/Root"

ReactDOM.render(React.createElement(Root, {}), document.getElementById("root"))

const canvas = document.getElementById("main-canvas") as HTMLCanvasElement

const antialias = true
let baby = new Engine(canvas, antialias)

let scene: Nullable<Scene> = null

const init = (state: State) => {
  scene = setupScene(baby)
  if (state.inspector) scene.debugLayer.show()
  setupCamera(state, scene).attachControl(canvas)
  baby.runRenderLoop(() => scene!.render())
}

const getState = (scene: Scene): State => {
  const camera = scene.activeCamera as CameraType
  return {
    camera: {
      position: camera.position,
      target: camera.getTarget(),
    },
    inspector: scene?.debugLayer.isVisible(),
  }
}

init({
  camera: {
    position: new Vector3(0, 2, -8),
    target: new Vector3(0, 0, 0),
  },
})

if (module.hot) {
  module.hot.accept("./scene", () => {
    const state = getState(scene!)
    baby.dispose()
    baby = new Engine(canvas, antialias)
    init(state)
  })
  module.hot.accept("./camera", () => {
    const state = getState(scene!)
    scene!.activeCamera!.dispose()
    setupCamera(state, scene!).attachControl(canvas)
  })
}

window.addEventListener("keydown", event => {
  if (event.keyCode === codes["\\"] && scene) {
    if (scene.debugLayer.isVisible()) {
      scene.debugLayer.hide()
    } else {
      scene.debugLayer.show()
    }
  }
})

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  baby.resize
})
