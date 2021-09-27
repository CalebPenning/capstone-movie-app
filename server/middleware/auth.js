const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config')
const { UnauthorizedError } = require("../expressError")

function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim()
            res.locals.user = jwt.verify(token, SECRET_KEY)
        }
        return next()
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
}

function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError()
        return next()
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
}

function ensureCorrectUser(req, res, next) {
    try {
        const user = res.locals.user
        if (!user.id === req.params.id || !user) {
            throw new UnauthorizedError()
        }
        return next()
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
}

module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureCorrectUser
}