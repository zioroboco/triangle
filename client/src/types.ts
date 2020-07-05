import { Vector3 } from "@babylonjs/core/Maths/math.vector"

export type State = {
  camera: {
    position: Vector3
    target: Vector3
  }
}
