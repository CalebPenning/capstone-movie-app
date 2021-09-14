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

    static async getAll() {
        let res = await db.query(`SELECT * FROM movies`)
        return res.rows
    }

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

        const movie = result.rows[0]

        return movie
    }

    static async getMovieByID(id) {
        const res = await axios.get(`${baseUrl}i=${id}`)
        if (res.status === 200) return res.data
        else return new BadRequestError(`Movie with ID of ${id} not found in database.`)
    }

    static async search(data) {
        try {
            const { search, type, year, pgNum } = data
            let results
            if (search && type && year && pgNum) results = await axios.get(`${baseUrl}s=${search}&type=${type}&y=${year}&page=${pgNum}`)
            if (search && type && year) results = await axios.get(`${baseUrl}s=${search}&type=${type}&y=${year}`)
            if (search && pgNum) results = await axios.get(`${baseUrl}s=${search}&page=${pgNum}`)
            if (search && year) results = await axios.get(`${baseUrl}s=${search}&y=${year}`)
            else results = await axios.get(`${baseUrl}s=${search}`)
        
            if (!results.status === 200) throw new BadRequestError(`Search did not elicit a 200 response. Check URL`)

            return results.data 
        } 
        
        catch (e) {
            throw new BadRequestError(`Yer search went bad bud!`)
        }
    }
}

module.exports = Movie