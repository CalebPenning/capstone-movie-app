const config = require('./config')

describe("Config file can get values from ENV", () => {
    test("Make it work", () => {
        expect(config.SECRET_KEY).toEqual("secret-key")
        expect(config.PORT).toEqual(3001)
        expect(config.BCRYPT_WORK_FACTOR).toEqual(1)

        delete process.env.SECRET_KEY
        delete process.env.PORT
        delete process.env.BCRYPT_WORK_FACTOR
        delete process.env.DATABASE_URL

        expect(config.getDbUri()).toEqual("cinema_test")

    })
})