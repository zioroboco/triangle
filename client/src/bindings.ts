import * as subject from "most-subject"
import { now } from "@most/core"
import { sink } from "./broker"

import("../../pkg").then(lib => {
  const origin = now(lib.rate())
  subject.attach(sink, origin)
})

module.hot?.accept()
