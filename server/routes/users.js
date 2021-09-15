const User = require('../models/user')
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

module.exports = router