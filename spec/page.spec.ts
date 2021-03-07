import * as execa from "execa"

const TEST_URL = process.env.TEST_URL ?? "http://localhost:8080"

beforeAll(async () => {
  await page.goto(TEST_URL)
})

afterAll(async () => {
  await browser.close()
})

it(`has the correct page title`, async () => {
  expect(await page.title()).toContain("△")
})

it(`was built from the correct commit`, async () => {
  const commit = execa.sync("git", ["rev-parse", "HEAD"]).stdout
  const metadata = await page
    .$$("meta")
    .then(tags => tags.pop()!)
    .then(tag => tag.getAttribute("content"))
  expect(metadata).toMatch(commit)
})
