import "./bindings"
import { BehaviorSubject } from "rxjs"

export const rate$: BehaviorSubject<number> = new BehaviorSubject(0)

module.hot?.accept()
