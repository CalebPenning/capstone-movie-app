const express = require('express')
const Review = require('../models/review')
const router = new express.Router()
const newReviewSchema = require('../schemas/reviewNew.json')
const updateReviewSchema = require('../schemas/reviewUpdate')
const { ensureLoggedIn } = require('../middleware/auth')
const User = require('../models/user')
const { UnauthorizedError, NotFoundError } = require('../expressError')
const validateData = require('../helpers/schemas')

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
        console.log(res.locals.user)
        if (user.username !== res.locals.user.username) {
            throw new UnauthorizedError(`You cannot post reviews for another user.`)
        }
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
        const originalUser = User.get(review.userID)
        if (res.locals.user.username !== originalUser.username) {
            throw new UnauthorizedError(`You cannot edit another user's reviews.`)
        }
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
        const originalUser = await User.get(review.userID)
        if (res.locals.user.username !== originalUser.username) {
            throw new UnauthorizedError(`You cannot delete another user's posts, no matter how tempting.`)
        }
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