import { createMachine } from "xstate"

export type State =
  | { value: "paused"; context: {} }
  | { value: "unpaused"; context: {} }

export type Event = { type: "TOGGLE" }

export type Context = {}

export const pauseMachine = createMachine<Context, Event, State>({
  id: "pause",
  initial: "unpaused",
  states: {
    unpaused: {
      on: {
        TOGGLE: {
          target: "paused",
        },
      },
    },
    paused: {
      on: {
        TOGGLE: {
          target: "unpaused",
        },
      },
    },
  },
})
