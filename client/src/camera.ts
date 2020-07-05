import { Scene } from "@babylonjs/core/scene"
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera"
import { codes } from "keycode"

import { State } from "./types"

export const initCamera = (state: State, scene: Scene): UniversalCamera => {
  const camera = new UniversalCamera("camera", state.camera.position, scene)
  camera.setTarget(state.camera.target)
  camera.speed = 0.2
  camera.keysUp = [codes.w]
  camera.keysDown = [codes.s]
  camera.keysLeft = [codes.a]
  camera.keysRight = [codes.d]
  return camera
}
