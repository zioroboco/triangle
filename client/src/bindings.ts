import * as broker from "./broker"
import { DIM_N, DIM_X, DIM_Y, N, Nullable } from "./types"
import { range } from "ramda"
import arrangement from "./arrangements"

type Data = Record<"ps" | "vs", Float64Array>
let state: Nullable<{ hot: true } & Data> = module.hot?.data?.state

let engine: import("../../pkg").State

import("../../pkg").then(({ State: Engine }) => {
  broker.updateStream.run(
    {
      event: (_, { deltaTime }) => {
        engine.update(deltaTime)
        const ps = engine.positions()
        broker.nextWorld({
          positions: range(0, N).map(i => [
            ps[i * DIM_N + DIM_X],
            ps[i * DIM_N + DIM_Y],
          ]),
        })
      },
      end: () => {},
      error: () => {},
    },
    broker.scheduler
  )
  engine?.free()
  engine = state?.hot
    ? Engine.init(state.ps, state.vs)
    : Engine.init(...arrangement())
})

if (module.hot) {
  module.hot.addDisposeHandler(data => {
    const hotState: Required<typeof state> = {
      ps: engine.positions(),
      vs: engine.velocities(),
      hot: true,
    }
    data.state = hotState
  })
}
