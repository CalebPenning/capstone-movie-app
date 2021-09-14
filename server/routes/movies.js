const jsonschema = require('jsonschema')
const express = require('express')

const { BadRequestError } = require('../expressError')
const Movie = require('../models/movie')

const router = new express.Router()

/**
 *  GET / Get all movies
 *  this route exists for debugging purposes 
 *  simply returns a list of all movies in the db currently
 *  does the trick 
 */

router.get("/", async (req, res, next) => {
    try {
        const result = await Movie.getAll()
        return res.json({ result })
    }

    catch(e) {
        return next(e)
    }
})

/**
 *  Does a search via the OMDB API based on a few parameters
 *  Basically just connects the OMDB API to our application 
 */

 router.get("/search", async (req, res, next) => {
    try {
        const results = await Movie.search(req.body)
        return res.json(results)
    } catch (e) {
        return next(e)
    }
})


/**
 *  GET /<id> Get a certain movie's information 
 *  based on its imdbID
 */

router.get("/:id", async (req, res, next) => {
    try {
        const result = await Movie.getMovieByID(req.params.id)
        return res.json({ result })
    }

    catch(e) {
        return next(e)
    }
})

module.exports = router