import { Scene } from "@babylonjs/core/scene"
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera"
import { codes } from "keycode"

import { State } from "./types"

export const setupCamera = (state: State, scene: Scene): UniversalCamera => {
  const camera = new UniversalCamera("camera", state.camera.position, scene)
  camera.setTarget(state.camera.target)
  setupControls(camera)
  return camera
}

const setupControls = (camera: UniversalCamera) => {
  camera.keysUp = [codes.w]
  camera.keysDown = [codes.s]
  camera.keysLeft = [codes.a]
  camera.keysRight = [codes.d]
  camera.speed = 0.2
}
