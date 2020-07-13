import { rate$ } from "./broker"

import("../../pkg").then(lib => {
  rate$.next(lib.rate())
})

module.hot?.accept()
