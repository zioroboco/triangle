import "./bindings"
import * as subject from "most-subject"
import { tap } from "@most/core"

const logUpdate = <T>(x: T) => console.log("Update: ", x)
const [sink, stream] = subject.create(tap<number>(logUpdate))

export { sink, stream }
