import "@babylonjs/core/Materials/standardMaterial"
import { BehaviorSubject } from "rxjs"
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color"
import { Engine } from "@babylonjs/core/Engines/engine"
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight"
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"

export const rate$: BehaviorSubject<number> = new BehaviorSubject(0)

export const setupScene = (baby: Engine): Scene => {
  let rate = 0
  import("./bindings").then(() => {
    rate$.subscribe(n => (rate = n))
  })

  const scene = new Scene(baby)
  scene.clearColor = Color4.FromColor3(Color3.Black())

  new HemisphericLight("light", new Vector3(0, 1, -1), scene)

  const poly = MeshBuilder.CreateDisc("poly", { tessellation: 3 }, scene)
  poly.rotate(Vector3.Forward(), Math.PI / 2)

  scene.onBeforeRenderObservable.add(() => {
    poly.rotate(Vector3.Forward(), rate)
  })

  return scene
}
