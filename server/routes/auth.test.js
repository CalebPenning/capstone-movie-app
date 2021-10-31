const request = require("supertest")

const app = require("../app")

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require("./_testCommon")

beforeAll(commonBeforeAll)
beforeEach(commonBeforeEach)
afterEach(commonAfterEach)
afterAll(commonAfterAll)

/** POST /auth/login */

describe("POST /auth/login", () => {
    test("It works", async () => {
        const resp = await request(app)
                .post("/auth/login")
                .send({
                    username: "testuser1",
                    password: "password1"
                })
        expect(resp.body).toEqual({
            "token": expect.any(String),
            "success": true
        })
    })

    test("Doesn't give token to bad login info", async () => {
        const resp = await request(app)
                .post("/auth/login")
                .send({
                    username: "not_a_user",
                    password: "password1"
                })
        expect(resp.statusCode).toEqual(401)
    })

    test("Doesn't give token for wrong password", async () => {
        const resp = await request(app)
                .post("/auth/login")
                .send({
                    username: "testuser1",
                    password: "wrongpassword"
                })
        expect(resp.statusCode).toEqual(401)
    })

    test("Reject requests with missing data", async () => {
        const resp = await request(app)
                .post("/auth/login")
                .send({
                    username: "testuser1"
                })
        expect(resp.statusCode).toEqual(400)
    })
})


/** POST /auth/register */

describe("POST /auth/register, signup route", () => {
    test("Works", async () => {
        const resp = await request(app)
                .post("/auth/register")
                .send({
                    username: "brand_new",
                    password: "brand_new",
                    firstName: "brand",
                    lastName: "new",
                    email: "brand@new.com",
                    bio: "a brand new user"
                })
        expect(resp.statusCode).toEqual(201)
        expect(resp.body).toEqual({
            "token": expect.any(String),
            "success": true
        })
    })

    test("Rejects requests with missing data", async () => {
        const resp = await request(app)
                .post("/auth/register")
                .send({
                    username: "helloworld",
                    password: ""
                })
        expect(resp.statusCode).toEqual(400)
    })

    test("Rejects requests with invalid data (json schema)", async () => {
        const resp = await request(app)
                .post("/auth/register")
                .send({
                    username: "newuser",
                    password: "password1",
                    firstName: "first",
                    lastName: "last",
                    email: "im a regular string",
                    bio: "I'm supposed to be a string"
                })

        expect(resp.statusCode).toEqual(400)
    })
})
