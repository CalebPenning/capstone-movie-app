const User = require('../models/user')
const Review = require('../models/review')
const express = require('express')
const router = new express.Router()

router.get('/', async (req, res, next) => {
    try {
        let users = await User.getAll()
        return res.json(users)
    } 
    
    catch(e) {
        return next(e)
    }
})

router.get('/:id/reviews', async (req, res, next) => {
    try {
        const id = req.params.id
        const response = await Review.getUserReviews(id)
        return res.json(response)
    }
    catch(e){}
})

router.post('/:id/follows', async (req, res, next) => {
    const userToFollowID = req.query
    
})

module.exports = router