const db = require('../db')
const { BadRequestError, NotFoundError, ExpressError } = require('../expressError')
const Movie = require('./movie')
const User = require('./user')

class Review {
    static async create({movieID, userID, rating, title, body}) {
        let movieCheck = await db.query(
            `SELECT id, title FROM movies WHERE id = $1`,
            [movieID]
        )
        if (!movieCheck.rows[0]) {
            let movie = await Movie.getMovieByID(movieID)
            let title = movie.result.title
            await Movie.create({id: movieID, title})
        }
        console.log(movieCheck)

        let res = await db.query(
            `INSERT INTO reviews
            (movie_id, user_id, rating, title, body)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, movie_id AS "movieID", user_id AS "userID", rating, title, body, created_at AS "createdAt"`,
            [movieID, userID, rating, title, body]
        )

        if (res.rows[0]) return ({ results: res, success: true})
        else return ({
            success: false,
            message: `unable to review movie with ID ${movieID}`
        })

    }

    static async getUserReviews(id) {
        let res = await db.query(
            `SELECT id, movie_id AS "movieID", user_id AS "userID", rating, title, body, created_at AS "createdAt"
            FROM reviews
            WHERE user_id = $1`, [id]
        )
        if (res.rows[0]) return res.rows
        else return `User with ID ${id} does not have any reviews.`
    }
}

module.exports = Review