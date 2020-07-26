import { Vector3 } from "@babylonjs/core/Maths/math.vector"

export * from "@babylonjs/core/types"

/** The number of particles in the universe. */
export const N = 800

/** The index offset for the x dimension. */
export const DIM_X = 0

/** The index offset for the y dimension. */
export const DIM_Y = 1

/** The total number of spatial dimensions. */
export const DIM_N = 2

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

export type Update = {
  deltaTime: number
}
