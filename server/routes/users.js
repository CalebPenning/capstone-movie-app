const User = require('../models/user')
const Review = require('../models/review')
const express = require('express')
const { BadRequestError } = require('../expressError')
const router = new express.Router()

router.get('/', async (req, res, next) => {
    try {
        let users = await User.getAll()
        return res.json(users)
    } 
    
    catch(e) {
        console.log(e)
        return next(e)
    }
})

router.get('/:id/reviews', async (req, res, next) => {
    try {
        const id = req.params.id
        const response = await Review.getUserReviews(id)
        return res.json(response)
    }
    catch(e){
        console.log(e)
        return next(e)
    }
})

/**
 *  The following route 
 */
router.post('/:id/following', async (req, res, next) => {
    try {
        const { userToFollowId } = req.body
        if (typeof userToFollowId !== "number") throw new BadRequestError("ID must be type number")
        const userID = req.params.id
        console.log(userToFollowId, userID)
        const followed = await User.followUser(userID, userToFollowId)
        return res.json({followed})
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

router.get('/:id/following', async (req, res, next) => {
    try {
        const userID = req.params.id
        const following = await User.getFollowedUsers(userID)
        return res.json({following})
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

router.get('/:id/followers', async (req, res, next) => {
    try {
        const userID = req.params.id
        const followers = await User.getFollowers(userID)
        return res.json({followers})
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

router.get('/:id/likes', async (req, res, next) => {
    try {
        const userID = req.params.id
        const liked = await User.getLikedReviews(userID)
        return res.json({liked})
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

router.post('/:id/likes', async (req, res, next) => {
    try {
        const { reviewID } = req.body
        const userID = req.params.id
        const liked = await User.like(userID, reviewID)
        return res.json({liked})
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

router.delete('/:id/likes', async (req, res, next) => {
    try {
        const { reviewID } = req.body
        const userID = req.params.id
        const unliked = await User.unlike(userID, reviewID)
        return res.json({unliked})
    }
    catch (e) {
        console.log(e)
        return next(e)
    }
})

module.exports = router