import { Vector3 } from "@babylonjs/core/Maths/math.vector"

export type State = {
  camera: {
    position: Vector3
    target: Vector3
  }
  inspector?: boolean
}

export type World = {
  positions: [number, number][]
}
