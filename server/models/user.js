const db = require('../db')
const bcrypt = require('bcrypt')
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError')
const { BCRYPT_WORK_FACTOR } = require('../config')

class User {
    static async getAll() {
        const result = await db.query(`SELECT * FROM users;`)
        return result.rows
    }

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

    static async register({ username, password, firstName, lastName, email, bio }) {
        const duplicateCheck = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`, [username])
        if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate username: ${username}`)

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)

        const result = await db.query(
            `INSERT INTO users
            (username,
            password,
            first_name,
            last_name,
            email,
            bio)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING username, first_name AS "firstName", last_name AS "lastName", email, bio`,
            [username, hashedPassword, firstName, lastName, email, bio]
        )

        const user = result.rows[0]

        return user
    }

    static async get(id) {
        const result = await db.query(
            `SELECT username,
                    first_name AS firstName,
                    last_name AS lastName,
                    email,
                    bio
            FROM users
            WHERE id = $1`, [id])

        if (result.rows[0]) return result.rows[0]
        else throw new BadRequestError(`No known user with id ${id}`)
    }

    // todo: get all following users, get all followed users
    // add follower, remove follower 
    // add like, remove like

    static async followUser(userID, userToFollowID) {
        // check and make sure both users are actually in the db
        const check1 = await db.query(
            `SELECT username FROM users WHERE id = $1`, [userID]
        )

        if (!check1.rows[0]) throw new NotFoundError(`User with ID ${userID} not found`)

        const check2 = await db.query(
            `SELECT username FROM users WHERE id = $1`, [userToFollowID]
        )

        if (!check2.rows[0]) throw new NotFoundError(`User with ID ${userToFollowID} not found`)

        const result = await db.query(
            `INSERT INTO follows
            (user_following_id, user_to_be_followed_id)
            VALUES ($1, $2)
            RETURNING user_following_id AS userFollowingId, 
            user_to_be_followed_id AS userFollowedId
            `, [userID, userToFollowID]
        )

        return result.rows[0]
    }

    
}

module.exports = User