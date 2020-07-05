import { FlyCamera } from "@babylonjs/core/Cameras/flyCamera"
import { Scene } from "@babylonjs/core/scene"
import { codes } from "keycode"

import { State } from "./types"

export type CameraType = FlyCamera

export const setupCamera = (state: State, scene: Scene): CameraType => {
  const camera = new FlyCamera("camera", state.camera.position, scene)
  camera.setTarget(state.camera.target)
  setupControls(camera)
  return camera
}

const setupControls = (camera: CameraType) => {
  camera.keysUp = [codes.e]
  camera.keysDown = [codes.q]
  camera.keysForward = [codes.w]
  camera.keysBackward = [codes.s]
  camera.keysLeft = [codes.a]
  camera.keysRight = [codes.d]
  camera.speed = 0.1
}
