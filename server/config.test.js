describe("Config file can get values from ENV", () => {
    test("Make it work", () => {
        process.env.SECRET_KEY = "Very_secret_indeed"
        process.env.PORT = "5000"
        process.env.DATABASE_URL = "the_database"
        process
    })
})