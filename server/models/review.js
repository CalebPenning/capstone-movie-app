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

    // get all reviews and neccesary data to display on a users profile
    static async getUserReviews(userID) {
        try {
            let res = await db.query(
                `SELECT 
                reviews.id as "reviewID",  
                reviews.user_id AS "userID", 
                reviews.rating, 
                reviews.title, reviews.body, 
                reviews.created_at, 
                movies.id AS "movieID", 
                movies.title,
                users.username
                FROM reviews, movies, users
                WHERE reviews.movie_id = movies.id 
                AND reviews.user_id = $1
                AND users.id = $1`,
                [userID]
            )
            return res.rows
        }
        catch(e) {
            console.error(e)
        }
    }
    // Get full review info, necessary user info, and necessary movie info for components

    static async getMovieReviews(movieID) {
        try {
            let res = await db.query(
                `SELECT 
                reviews.id as "reviewID", 
                reviews.rating, reviews.title, 
                reviews.body, reviews.created_at, 
                users.id AS "userID", 
                users.username, movies.title, 
                movies.id AS "movieID"
                FROM reviews, users, movies
                WHERE reviews.movie_id = $1 AND reviews.user_id = users.id AND movies.id = reviews.movie_id
                ORDER BY reviews.created_at ASC`, [movieID]
            )
            return res.rows
        }

        catch(e) {
            console.log(e)
        }
    }
}

module.exports = Review