import { DIM_N, DIM_X, DIM_Y, N } from "./types"
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector"
import { range } from "ramda"

const rand = (min: number, max: number) => Math.random() * (max - min) + min

export const swarm = (length = N): [Float64Array, Float64Array] => {
  let ps: number[] = []
  let vs: number[] = []
  range(0, length).forEach(i => {
    const pos_theta = Matrix.RotationAxis(Vector3.Up(), rand(0, 2 * Math.PI))
    const pos = Vector3.TransformCoordinates(
      Vector3.Forward().scale(rand(2.5, 4)),
      pos_theta
    )
    const vel_theta = Matrix.RotationAxis(Vector3.Up(), rand(0.1, 0.2))
    const vel = Vector3.TransformCoordinates(
      Vector3.Cross(pos, Vector3.Up()).scale(rand(0.3, 0.6)),
      vel_theta
    )

    ps[i * DIM_N + DIM_X] = pos.x
    ps[i * DIM_N + DIM_Y] = pos.z
    vs[i * DIM_N + DIM_X] = vel.x
    vs[i * DIM_N + DIM_Y] = vel.z
  })
  return [new Float64Array(ps), new Float64Array(vs)]
}

export const line = (length = N): [Float64Array, Float64Array] => {
  let ps: number[] = []
  let vs: number[] = []
  range(0, length).forEach(i => {
    const pos = Vector3.Forward().scale(2 + i * 0.0006)

    const vel_theta = Matrix.RotationAxis(Vector3.Up(), 1)
    const vel = Vector3.TransformCoordinates(
      Vector3.Cross(pos, Vector3.Up()),
      vel_theta
    )

    ps[i * DIM_N + DIM_X] = pos.x
    ps[i * DIM_N + DIM_Y] = pos.z
    vs[i * DIM_N + DIM_X] = vel.x
    vs[i * DIM_N + DIM_Y] = vel.z
  })
  return [new Float64Array(ps), new Float64Array(vs)]
}

export const simple = (length = N): [Float64Array, Float64Array] => {
  let ps: number[] = []
  let vs: number[] = []
  range(0, length).forEach(i => {
    const pos = Vector3.Forward().scale(2.0 * ((i % 2) * 2 - 1))
    const vel = Vector3.Cross(pos, Vector3.Up())

    ps[i * DIM_N + DIM_X] = pos.x
    ps[i * DIM_N + DIM_Y] = pos.z
    vs[i * DIM_N + DIM_X] = vel.x
    vs[i * DIM_N + DIM_Y] = vel.z
  })
  return [new Float64Array(ps), new Float64Array(vs)]
}

export default simple
