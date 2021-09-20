const express = require('express')
const { BadRequestError, NotFoundError } = require('../expressError')
const Movie = require('../models/movie')
const Review = require('../models/review')
const router = new express.Router()
const omdbAPI = require('../models/omdbAPI')

router.get("/:id", async (req, res, next) => {
    try {
        let result = await Review.get(req.params.id)
        return res.json(result)
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

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

// update review
router.patch("/:id", async (req, res, next) => {
    try {
        let data = req.body
        const updatedReview = await Review.updateReview(req.params.id, data)
        return res.json({ updatedReview })
    }

    catch(e) {
        console.log(e)
        return next(e)  
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        const deleted = await Review.deleteReview(req.params.id)
        return res.json({deleted})
    }

    catch(e) {
        console.log(e)
        return next(e)
    }
})

// delete review 

module.exports = router