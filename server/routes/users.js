const User = require('../models/user')
const Review = require('../models/review')
const express = require('express')
const { BadRequestError, UnauthorizedError } = require('../expressError')
const { ensureLoggedIn, authenticateJWT } = require('../middleware/auth')
const updateUserSchema = require('../schemas/userUpdate.json')
const validateData = require('../helpers/schemas')
const { compareUsers, ensureUsers, ensureFollowing } = require('../helpers/users')
const router = new express.Router()

// router.get('/:username', async (req, res, next) => {
//     try {
//         const username = req.params.username
//         const user = await User.getByUsername(username)
//         if (user) return res.json({ user })
//         else return {}
//     }
//     catch(e) {
//         console.log(e)
//         return next(e)
//     }
// })

/** GET /users/:id => { user: userObj }
 *  given a valid user ID, returns a user object from db
 *  used to get a user's information for their profile  
 */
router.get('/:id', async (req, res, next) => {
    try {
        const userID = req.params.id
        let user = await User.get(userID)
        return res.json({ user })
    } 
    
    catch(e) {
        console.log(e)
        return next(e)
    }
})


/** PATCH /users/:id => { updated: userObj }
 *  Allows users to update their account information
 *  User attempting to make the request must have a valid jwt
 *  and it must match the user that the account belongs to 
 */
router.patch('/:id', [authenticateJWT, ensureLoggedIn], async (req, res, next) => {
    try {
        await compareUsers(res, req.params.id)
        validateData(req, updateUserSchema)
        const updated = await User.update(req.params.id, req.body)
        return res.json({ updated })
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

/**
 *  DELETE /users/:id => { deleted: userID }
 *  Allows a user to delete THEIR OWN account
 *  TODO: write method for account deletion,
 *  implement middleware described above ^^
 */
router.delete('/:id', [authenticateJWT, ensureLoggedIn], async (req, res, next) => {
    try {
        await compareUsers(res, req.params.id)
        const deleted = await User.delete(req.params.id)
        return res.json({ deleted })
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

/**
 *  GET /users/:id/reviews => { reviews: Array[reviewObj] }
 *  returns an object containing a list of a user's reviews
 */
router.get('/:id/reviews', async (req, res, next) => {
    try {
        const id = req.params.id
        const reviews = await Review.getUserReviews(id)
        return res.json({ reviews })
    }
    catch(e){
        console.log(e)
        return next(e)
    }
})

/** POST /users/:id/following => { followed: userFollowingId, userFollowedId }
 *  This route allows a user to follow another user 
 *  JSON body should have one attribute: userToFollowId,
 *  which is a number that corresponds to the ID of the user to follow.
 */
router.post('/:id/following', [authenticateJWT, ensureLoggedIn], async (req, res, next) => {
    try {
        const userID = req.params.id
        const { userToFollowID } = req.body
        await compareUsers(res, userID)
        await ensureUsers(userID, userToFollowID)
        const followed = await User.followUser(userID, userToFollowID)
        return res.json({ followed })
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

/** GET => /users/:id/following => { following: Array[userObj] }
 *  Given a user ID, returns a list of users they follow
 */
router.get('/:id/following', async (req, res, next) => {
    try {
        const userID = req.params.id
        const following = await User.getFollowedUsers(userID)
        return res.json({ following })
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

/** DELETE => /users/:id/following => { unfollowed: userObj }
 *  Given a url param: user ID, unfollows a user based on the user ID in the json body, userToUnfollowID
 */
router.delete('/:id/following', [authenticateJWT, ensureLoggedIn], async (req, res, next) => {
    try {
        const userID = req.params.id
        const { userToUnfollowID } = req.body
        await compareUsers(res, userID)
        await ensureFollowing(userID, userToUnfollowID)
        const unfollowed = await User.unfollowUser(userID, userToUnfollowID)
        return res.json({ unfollowed })
    }

    catch(e) {
        console.log(e)
        return next(e)
    }
})

/** GET /users/:id/followers 
 *  given a url param user id, returns a list of users that follow them
 */
router.get('/:id/followers', async (req, res, next) => {
    try {
        const userID = req.params.id
        const followers = await User.getFollowers(userID)
        return res.json({ followers })
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

/** GET /users/:id/likes => { likes: Array[reviewObj] }
 *  Given the user ID, returns a lists of reviews they've liked 
 */
router.get('/:id/likes', async (req, res, next) => {
    try {
        const userID = req.params.id
        const likes = await User.getLikedReviews(userID)
        return res.json({ likes })
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})


/** POST /users/:id/likes
 *  Given a user Id, and a json body with a Review ID,
 *  add that review to a user's 'likes'
 */
router.post('/:id/likes', [authenticateJWT, ensureLoggedIn], async (req, res, next) => {
    try {
        const userID = req.params.id
        await compareUsers(res, req.params.id)
        const { reviewID } = req.body
        if (!reviewID) throw new BadRequestError(`Must pass a review ID to like`)
        const liked = await User.like(userID, reviewID)
        return res.json({ liked })
    }
    catch(e) {
        console.log(e)
        return next(e)
    }
})

/** DELETE /users/:id/likes
 * Given a user ID and a json body with a review ID,
 * remove the review from a user's 'likes'
 */
router.delete('/:id/likes', async (req, res, next) => {
    try {
        const { reviewID } = req.body
        const userID = req.params.id
        await compareUsers(res, userID)
        const unliked = await User.unlike(userID, reviewID)
        return res.json({ unliked })
    }
    catch (e) {
        console.log(e)
        return next(e)
    }
})

module.exports = router