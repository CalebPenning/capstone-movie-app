const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require("../config")

/**
 *  return a signed JWT with user info
 */

const createToken = user => {
    let payload = { username: user.username }
    return jwt.sign(payload, SECRET_KEY)
}

module.exports = createToken