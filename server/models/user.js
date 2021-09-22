const db = require('../db')
const bcrypt = require('bcrypt')
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError')
const sqlForPartialUpdate = require('../helpers/sql')
const { BCRYPT_WORK_FACTOR } = require('../config')

class User {
    // static async getAll() {
    //     const result = await db.query(`SELECT * FROM users;`)
    //     return result.rows
    // }

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

    static async update(userID, data) {
        const checkUser = await this.get(userID)
        if (!checkUser.username) throw new NotFoundError(`No user with ID ${userID} found`)
        const { updateCols, values } = sqlForPartialUpdate(data, {firstName: "first_name", lastName: "last_name", email: "email", bio: "bio"})

        const usernameIdx = "$" + (values.length + 1)

        const query = 
        `UPDATE users
        SET ${updateCols}
        WHERE id = ${usernameIdx}
        RETURNING id, username, 
        first_name AS firstName,
        last_name AS lastName,
        email, bio`

        const result = await db.query(query, [...values, userID])
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

        if (!result.rows[0]) throw new NotFoundError(`No known user with id ${id}`)
        return result.rows[0]
    }

    static async delete(id) {
        const result = await db.query(
            `DELETE FROM
            users
            WHERE id = $1
            RETURNING id, username`,
            [id]
        )

        return result.rows[0]
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

    static async unfollowUser(userID, userToUnfollowID) {
        const check1 = await db.query(
            `SELECT username FROM users WHERE id = $1`, [userID]
        )

        if (!check1.rows[0]) throw new NotFoundError(`User with ID ${userID} not found`)

        const check2 = await db.query(
            `SELECT username FROM users WHERE id = $1`, [userToUnfollowID]
        )

        if (!check2.rows[0]) throw new NotFoundError(`User with ID ${userToUnfollowID} not found`)

        const result = await db.query(
            `DELETE 
            FROM follows
            WHERE user_following_id = $1
            AND user_to_be_followed_id = $2
            RETURNING user_to_be_followed_id AS userToBeFollowedId`,
            [userID, userToUnfollowID]
        )

        if (!result.rows[0]) throw new BadRequestError(`Could not unfollow user. Check errors`)

        return result.rows[0]
    }

    //takes a user ID and returns all users they are following
    static async getFollowedUsers(userID) {
        // first just make sure the user exists
        const userCheck = await db.query(
            `SELECT id, username FROM users WHERE id = $1`, [userID]
        )

        if (!userCheck.rows[0]) throw new NotFoundError(`User with ID ${userID} not found`)

        const following = await db.query(
            `SELECT
            users.id AS "userID",
            users.username,
            users.first_name AS "firstName",
            users.last_name AS "lastName",
            users.email, 
            users.bio
            FROM users, follows
            WHERE users.id = follows.user_to_be_followed_id
            AND follows.user_following_id = $1`, [userID]
        )
        
        if (!following.rows[0]) throw new BadRequestError(`Could not get follows for User with ID ${userID}`)

        return following.rows
    }

    static async getFollowers(userID) {
        const userCheck = await db.query(
            `SELECT id, username FROM users WHERE id = $1`, [userID]
        )

        if (!userCheck.rows[0]) throw new NotFoundError(`User with ID ${userID} not found`)
        
        const followers = await db.query(
            `SELECT
            users.id AS "userID",
            users.username,
            users.first_name AS "firstName",
            users.last_name AS "lastName",
            users.email,
            users.bio
            FROM users, follows
            WHERE users.id = follows.user_following_id
            AND follows.user_to_be_followed_id = $1`, [userID]
        )

        if (!followers.rows[0]) throw new BadRequestError(`Could not get followers for User with ID ${userID}`)

        return followers.rows
    }

    static async like(userID, reviewID) {
        const userCheck = await db.query(
            `SELECT id, username FROM users WHERE id = $1`, [userID]
        )

        if (!userCheck.rows[0]) throw new NotFoundError(`User with ID ${userID} not found`)

        const reviewCheck = await db.query(
            `SELECT id, title, body FROM reviews WHERE id = $1`, [reviewID]
        )

        if (!reviewCheck.rows[0]) throw new NotFoundError(`Review with ID ${reviewID} not found`)

        const result = await db.query(
            `INSERT INTO
            likes (user_id, review_id)
            VALUES ($1, $2)
            RETURNING review_id AS "reviewID"`, 
            [userID, reviewID]
        )

        if (!result.rows[0]) throw new BadRequestError(`Could not successfully like Review with ID ${reviewID}`)

        return result.rows[0]
    }

    static async unlike(userID, reviewID) {
        const userCheck = await db.query(
            `SELECT id, username FROM users WHERE id = $1`, [userID]
        )

        if (!userCheck.rows[0]) throw new NotFoundError(`User with ID ${userID} not found`)

        const reviewCheck = await db.query(
            `SELECT id, title, body FROM reviews WHERE id = $1`, [reviewID]
        )

        if (!reviewCheck.rows[0]) throw new NotFoundError(`Review with ID ${reviewID} not found`)

        const result = await db.query(
            `DELETE
            FROM likes
            WHERE user_id = $1
            AND review_id = $2
            RETURNING review_id AS "reviewID"`,
            [userID, reviewID]
        )

        if (!result.rows[0]) throw new BadRequestError(`Review with ID ${reviewID} could not be removed from likes`)

        return result.rows[0]
    }

    static async getLikedReviews(userID) {
        const userCheck = await db.query(
            `SELECT id, username FROM users WHERE id = $1`, [userID]
        )

        if (!userCheck.rows[0]) throw new NotFoundError(`User with ID ${userID} not found`)

        const result = await db.query(
            `SELECT
            reviews.rating, reviews.title AS "reviewTitle",
            reviews.body, reviews.created_at AS "createdAt",
            users.username AS "postedBy",
            users.id AS "userID",
            movies.title AS "movieTitle",
            movies.id AS "movieID"
            FROM reviews, likes, users, movies
            WHERE likes.user_id = $1 AND likes.review_id = reviews.id
            AND reviews.user_id = users.id AND reviews.movie_id = movies.id`,
            [userID]
        )

        if (!result.rows[0]) return { message: `User with ID ${userID} hasn't published any reviews yet` }
    
        return result.rows
    }
}

module.exports = User