const jsonschema = require('jsonschema')
const express = require('express')
const Review = require('../models/review')
const { BadRequestError } = require('../expressError')
const Movie = require('../models/movie')

const router = new express.Router()

/**
 *  Does a search via the OMDB API based on a few parameters
 *  Basically just connects the OMDB API to the application 
 */

 router.get("/search", async (req, res, next) => {
    try {
        const results = await Movie.search(req.body)
        return res.json(results)
    } 
    catch (e) {
        console.log(e)
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
        console.log(e)
        return next(e)
    }
})

router.get("/:id/reviews", async (req, res, next) => {
    try {
        const id = req.params.id
        const reviews = await Review.getMovieReviews(id)
        console.log(reviews)
        return res.json(reviews)
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

module.exports = router