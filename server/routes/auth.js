const jsonschema = require('jsonschema')
const express = require('express')

const userAuthSchema = require('../schemas/userAuth.json')
const userRegisterSchema = require('../schemas/userNewSchema.json')

const User = require('../models/user')

const { BadRequestError } = require('../expressError')
const createToken = require('../helpers/tokens')
const router = new express.Router()

/**
 *  POST /login: { username, password } => { token }
 * 
 *  returns JWT that will authenticate user's requests
 * 
 *  Obviously, no authorization is required for this route
 */

router.post("/login", async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema)

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }

        const { username, password } = req.body
        const user = await User.authenticate(username, password)
        const token = createToken(user)
        return res.json({ token, success: true })
    }

    catch(e) {
        return next(e)
    }
})

/**
 *  POST /auth/register: { userinfo } => { token }
 * 
 *  Required fields from user: { username, password, firstName, lastName, email }
 *  Optional: { bio }
 * 
 *  Creates a new user account and returns a JWT that will authenticate further user requests
 * 
 *  No authorization required
 */

router.post("/register", async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, userRegisterSchema)
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }

        const bio = req.body.bio || ""

        const newUser = User.register({...req.body, bio})
        const token = createToken(newUser)
        return res.status(201).json({ token, success: true })
    }

    catch(e) {
        return next(e)
    }
})



module.exports = router