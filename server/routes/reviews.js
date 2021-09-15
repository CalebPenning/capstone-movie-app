const express = require('express')
const { BadRequestError } = require('../expressError')
const Movie = require('../models/movie')
const Review = require('../models/review')
const router = new express.Router()

/**
 *  POST / Create a new review
 */
router.post("/", async (req, res, next) => {
    try {
        let result = await Review.create(req.body)
        return res.status(201).json(result)
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

/**
 *  GET /user/:user_id
 *  Get all of a users reviews by their id
 */

router.get("/users/:user_id", async (req, res, next) => {
    try {
        const userReviews = await Review.getUserReviews(req.params.user_id) 
        return res.json({ reviews: userReviews })
    }

    catch(e) {
        return next(e)
    }
})

/**
 *  GET /movies/:movie_id
 *  Get all reviews for a certain movie or tv show 
 */

router.get("/movies/:movie_id", async (req, res, next) => {
    try {
        const reviews = await Review.getMovieReviews(req.params.movie_id)
        return res.json({ reviews })
    }

    catch(e) {
        console.log(e)
        return next(e)
    }
})

// update review
router.patch("/:id", async (req, res, next) => {
    try {
        
    }

    catch(e) {
        console.log(e)
        return next(e)  
    }
})
// delete review 

module.exports = router