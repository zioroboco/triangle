const root = document.createElement("div")
document.body.appendChild(root)

import("../pkg").then(engine => {
  root.innerHTML = `<h1 style="text-align: center;">${engine.message()}</h1>`
})
