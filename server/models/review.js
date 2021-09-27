const db = require('../db')
const { BadRequestError, NotFoundError, ExpressError } = require('../expressError')
const sqlForPartialUpdate = require('../helpers/sql')
const Movie = require('./movie')
const User = require('./user')
const omdbAPI = require('./omdbAPI')

class Review {
    static async get(id) {
        const result = await db.query(
            `SELECT id, user_id AS "userID", rating, title, body, created_at AS "createdAt"
            FROM reviews WHERE id = $1`, [id]
        )
        if (!result.rows[0]) throw new NotFoundError(`Review with ID ${id} not found`)

        return result.rows[0]
    }

    static async create({movieID, userID, rating, title, body}) {
        try {
            // check for movie in db, if not there, create it
            console.log(arguments)
            let movieCheck = await db.query(
                `SELECT id, title FROM movies WHERE id = $1`,
                [movieID])
            if (!movieCheck.rows[0]) {
                let movieInfo = await Movie.getMovieByID(movieID)

                if (!movieInfo.Title) throw new BadRequestError(`Invalid ID passed`)
                let title = movieInfo.Title

                await Movie.create({id: movieID, title})
            }

            let userCheck = await User.get(userID)

            if (!userCheck.id) throw new NotFoundError(`Cannot create review. User with ID ${userID} was not found.`)
            
            let res = await db.query(
                `INSERT INTO reviews
                (movie_id, user_id, rating, title, body)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, movie_id AS "movieID", user_id AS "userID", rating, title, body, created_at AS "createdAt"`,
                [movieID, userID, rating, title, body]
            )

            if (res.rows[0]) return ({ created: res.rows[0]})
            else throw new BadRequestError(`unable to review movie with ID ${movieID}`, 400)  
        }
        catch(e) {
            console.error(e)
            return e
        }

    }

    // get all reviews and neccesary data to display on a users profile
    static async getUserReviews(userID) {
        try {
            let res = await db.query(
                `SELECT 
                reviews.id as "reviewID",  
                reviews.user_id AS "userID", 
                reviews.rating, 
                reviews.title AS "reviewTitle", reviews.body, 
                reviews.created_at AS "createdAt", 
                movies.id AS "movieID", 
                movies.title AS "movieTitle",
                users.username
                FROM reviews, movies, users
                WHERE reviews.movie_id = movies.id 
                AND reviews.user_id = $1
                AND users.id = $1
                ORDER BY reviews.created_at ASC`,
                [userID]
            )
            return res.rows
        }
        catch(e) {
            console.error(e)
            return e
        }
    }
    // Get full review info, necessary user info, and necessary movie info for components

    static async getMovieReviews(movieID) {
        try {
            let res = await db.query(
                `SELECT 
                reviews.id as "reviewID", 
                reviews.rating, reviews.title, 
                reviews.body, 
                reviews.created_at AS "createdAt", 
                users.id AS "userID", 
                users.username, movies.title, 
                movies.id AS "movieID"
                FROM reviews, users, movies
                WHERE reviews.movie_id = $1 
                AND reviews.user_id = users.id 
                AND movies.id = reviews.movie_id
                ORDER BY reviews.created_at ASC`, [movieID]
            )
            return res.rows
        }

        catch(e) {
            console.error(e)
            return e
        }
    }

    // programatically updates a review based on some params

    static async updateReview(revID, data) {
        const checkReview = await db.query(
            `SELECT id FROM reviews WHERE id = $1`, [revID]
        )

        if (!checkReview.rows[0]) throw new NotFoundError(
        `Review with ID ${revID} cannot be updated, as it does not exist.`)
        console.log(data)
        const { updateCols, values } = sqlForPartialUpdate(data, {rating: "rating", title: "title", body: "body"})

        const reviewIdIdx = "$" + (values.length + 1)

        const query = `UPDATE reviews
        SET ${updateCols}
        WHERE id = ${reviewIdIdx}
        RETURNING id, rating, title, body, created_at AS createdAt`
        console.log(`QUERY: ${query}, UPDATE COLS AND DATA: ${updateCols, data}`)

        const result = await db.query(query, [...values, revID])

        const review = result.rows[0]

        if (!review) throw new NotFoundError(`No review with ID ${revID}`)

        return review
    }

    static async deleteReview(revID) {
        const result = await db.query(
            `DELETE 
            FROM reviews
            WHERE id = $1
            returning id, rating, title, body`,
            [revID])
        const review = result.rows[0] 

        if (!review) throw new NotFoundError(`No review with ID of ${revID}`)

        return review
    }
}

module.exports = Review