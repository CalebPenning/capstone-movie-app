const User = require('../models/user')
const db = require('../db')
const { UnauthorizedError, BadRequestError } = require('../expressError')
/**
 * Given a res object with or without a jwt stored on it,
 * as well as a user's id from a url parameter,
 * compare whether or not they are the same user
 */
async function compareUsers(res, originalUserID) {
    const requestingUser = res.locals.user.username
    const originalUser = await User.get(originalUserID)
    if (requestingUser !== originalUser.username) {
        throw new UnauthorizedError(`You do not have permissions to post information to another account.`)
    }
}

/**
 *  Given two user ids,
 *  make sure they are both actual users
 *  to be used when following users
 */
async function ensureUsers (followingID, followedID) {
    if (followingID === followedID) throw new BadRequestError(`You can't follow yourself, no matter how cool you are.`)
    const followingUser = await User.get(followingID)
    const followedUser = await User.get(followedID)

    if (!followingUser.username || !followedUser.username) {
        throw new BadRequestError(`Couldn't one or more users given these ids: YOUR ID: ${followingID} THEIR ID: ${followedID}`)
    }
    // check if user already follows user
    const followCheck = await db.query(
        `SELECT 
        user_following_id AS userFollowingID, 
        user_to_be_followed_id AS userFollowedID
        FROM follows
        WHERE user_following_id = $1
        AND user_to_be_followed_id = $2`,
        [followingID, followedID]
    )

    if (followCheck.rows.length) throw new BadRequestError(`You already follow ${followedUser.username}`)
}

module.exports = compareUsers