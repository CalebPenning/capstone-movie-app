const express = require('express')
const Review = require('../models/review')
const Movie = require('../models/movie')

const router = new express.Router()

/** GET /movies/search
 *  Does a search via the OMDB API based on a few parameters
 *  Basically just connects the OMDB API to the application 
 */

 router.get("/search", async (req, res, next) => {
    try {
        console.log(req)
        const results = await Movie.search(req.query)
        return res.json(results)
    } 
    catch (e) {
        console.log(e)
        return next(e)
    }
})

/**
 *  GET /movies/:id 
 *  Get a certain movie's information 
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

/** 
 * 
 */
router.get("/:id/reviews", async (req, res, next) => {
    try {
        const id = req.params.id
        const reviews = await Review.getMovieReviews(id)
        return res.json(reviews)
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

module.exports = router