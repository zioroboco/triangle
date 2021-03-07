const TEST_URL = process.env.TEST_URL ?? "http://localhost:8080"

beforeAll(async () => {
  await page.goto(TEST_URL)
})

afterAll(async () => {
  await browser.close()
})

it(`works`, async () => {
  expect(await page.title()).toContain("△")
})
