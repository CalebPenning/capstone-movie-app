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
        console.log(res)

        if (res.rows[0]) return ({ created: res.rows[0]})
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
        console.log(res.rows)
        if (res.rows[0]) return res.rows
        else return `User with ID ${id} does not have any reviews.`
    }

    static async getFullReview(userID) {
        try {
            let res = await db.query(
                `SELECT reviews.id, reviews.movie_id, reviews.user_id, reviews.rating, reviews.title, reviews.body, reviews.created_at, movies.id, movies.title
                FROM reviews, movies
                WHERE reviews.movie_id = movies.id AND reviews.user_id = $1`,
                [userID]
            )
            return res.rows
        }
        catch(e) {
            console.error(e)
        }
    }
}

module.exports = Review