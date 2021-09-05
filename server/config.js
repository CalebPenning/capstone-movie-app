require('dotenv').config()
require('colors')

const SECRET_KEY = process.env.SECRET_KEY || "secret-key"
const PORT = +process.env.PORT || 3001

const getDbUri = () => (
    process.env.NODE_ENV === "test" ?
        "jobly_test" :
        process.env.DATABASE_URL || "cinema"
)

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12

console.log("Cinema Config".green)
console.log("SECRET_KEY".yellow, SECRET_KEY)
console.log("PORT".yellow, PORT.toString())
console.log("BCRYPT WORK FACTOR".yellow, BCRYPT_WORK_FACTOR)
console.log("Database: ".yellow, getDbUri())
console.log("-----")

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDbUri
}