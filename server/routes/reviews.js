const express = require('express')
const Review = require('../models/review')
const router = new express.Router()
const newReviewSchema = require('../schemas/reviewNew.json')
const updateReviewSchema = require('../schemas/reviewUpdate')
const { ensureLoggedIn } = require('../middleware/auth')
const User = require('../models/user')
const { UnauthorizedError, NotFoundError } = require('../expressError')
const validateData = require('../helpers/schemas')
const { compareUsers } = require('../helpers/users')

/** GET /reviews/:id
 *  Retrieves one review, based on its ID
 */
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
router.post("/", ensureLoggedIn, async (req, res, next) => {
    try {
        const user = await User.get(req.body.userID)
        await compareUsers(res, user.id)
        validateData(req, newReviewSchema)
        let result = await Review.create(req.body)
        return res.status(201).json(result)
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

// update review
router.patch("/:id", ensureLoggedIn, async (req, res, next) => {
    try {
        const review = await Review.get(req.params.id)
        if (!review.id) throw new NotFoundError(`Review with ID ${req.params.id} not found`)
        console.log(review)
        const originalUser = await User.get(review.userID)
        console.log(`THIS IS THE USER GRABBED IN THE PATCH METHOD: ${originalUser}`)
        await compareUsers(res, originalUser.id)
        validateData(req, updateReviewSchema)
        let data = req.body
        const updatedReview = await Review.updateReview(req.params.id, data)
        return res.json({ updatedReview })
    }

    catch(e) {
        console.log(e)
        return next(e)  
    }
})
// delete review
router.delete("/:id", ensureLoggedIn, async (req, res, next) => {
    try {
        const review = await Review.get(req.params.id)
        if (!review.id) throw new NotFoundError(`Review with ID ${req.params.id} not found`)
        await compareUsers(res, review.userID)
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