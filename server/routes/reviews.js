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
        return next(new BadRequestError("Yer review got messed up bud"))
    }
})

/**
 *  GET /user/:user_id
 *  Get all of a users reviews by their id
 */

router.get("/users/:user_id", async (req, res, next) => {
    try {
        const userReviews = await Review.getUserReviews(req.params.user_id) 
        return res.json({reviews: userReviews})
    }

    catch(e) {
        return next(e)
    }
}) 

router.get('/test', async (req, res, next) => {
    try {
        let tester = await Review.getFullReview(1)
        return res.json({tester})
    }

    catch(e) {
        return next(e)
    }
})

module.exports = router