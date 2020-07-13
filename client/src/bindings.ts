import { rate$ } from "./scene"

import("../../pkg").then(lib => {
  rate$.next(lib.rate())
})

module.hot?.accept()
