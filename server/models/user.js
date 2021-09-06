const db = require('../db')
const bcrypt = require('bcrypt')
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError')
const { BCRYPT_WORK_FACTOR } = require('../config')

class User {
    static async authenticate(username, password) {
        const result = await db.query(
            `SELECT username,
                    password,
                    first_name AS "firstName",
                    last_name AS lastName,
                    email,
                    bio
            FROM users
            WHERE username = $1`,
            [username])

        const user = result.rows[0]

        if (user) {
            const isValid = await bcrypt.compare(password, user.password)
            if (isValid) {
                delete user.password
                return user
            }
        }
        throw new UnauthorizedError("Invalid username/password")
    }



}