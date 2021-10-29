const request = require("supertest")

const app = require("./app")
const db = require("./db")

test("Returns status code 404 for a non-existant path", async () => {
    const resp = await request(app).get("/non-existant")
    expect(resp.statusCode).toEqual(404)
})

afterAll(() => {
    db.end()
})