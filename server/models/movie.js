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
            [id]
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
            /**
             *  Search takes a few parameters:
             *  s = Search term. REQUIRED. The keyword(s) the user uses to search for a movie or tv show
             *  y = Year of release. OPTIONAL. 
             *  type = Type of result. Valid options include:
             *  "movie", "series", "episode"
             *  OPTIONAL
             *  page = page number. Defaults to one. 
             * 
             *  Sending a request like:
             *  {s: "titanic", type: "movie", y: 1997, page: 1}
             *  
             *  will build this url:
             *  `baseurl.com/?apikey=apikey&s=titanic&type=movie&y=1997&page=1&`
             *  call the api, and return the results
             */
            let searchUrl = baseUrl
            for (let key in data) {
                searchUrl += `${key}=${data[key]}&`
            }
            console.log(searchUrl)

            const results = await axios.get(searchUrl)

            if (!results.status === 200) throw new BadRequestError(`Invalid Search`)

            return results.data
        } 
        
        catch (e) {
            throw new BadRequestError(`Yer search went bad bud!`)
        }
    }
}

module.exports = Movie