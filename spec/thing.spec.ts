const PORT = process.env.PORT ?? "8080"

beforeAll(async () => {
  await page.goto(`http://localhost:${PORT}`)
})

afterAll(async () => {
  await browser.close()
})

it(`works`, async () => {
  expect(await page.title()).toContain("△")
})
