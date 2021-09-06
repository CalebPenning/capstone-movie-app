const db = require('../db')
const { BadRequestError, NotFoundError, ExpressError } = require('../expressError')
const axios = require('axios')
const { apiKey, baseUrl } = require('../secrets')

class Movie {
    /**
     *  Create a reference instance for a movie
     *  Used mostly to store the imdb ID for easier API calls.
     *  data passed will be { imdbID, title }
     *  This will not happen directly, but will happen on the first instance of a user making a review for the movie.
     * That way, we can persist only the title for reference, 
     *  as well as the imdb ID to make a direct call to the omdb API 
     */

    static async create({id, title}) {
        const duplicateCheck = await db.query(
            `SELECT id, title
            FROM movies
            WHERE id = $1`,
            [id, title]
        )

        if (duplicateCheck.rows[0]) 
            throw new BadRequestError(`Duplicate movie: ${title}`)
        
        const result = await db.query(
            `INSERT INTO movies (id, title)
            VALUES ($1, $2)
            RETURNING id, title`, [id, title]
        )

        const company = result.rows[0]

        return company
    }

    static async getAll() {
        const result = await db.query(
            `SELECT * FROM movies`
        )
        return result.rows
    }

    static async getMovieByID(id) {
        const res = await axios.get(`${baseUrl}i=${id}`)
        console.log(res)
        if (res.status === 200) return res.data
        else return new BadRequestError(`Movie with ID of ${id} not found in database.`)
    }

    /**
     *  TODO: ??
     */
}

module.exports = Movie