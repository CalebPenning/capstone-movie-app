const db = require("../db")
const User = require('../models/user')
const Movie = require('../models/movie')
const Review = require('../models/review')
const createToken  = require('../helpers/tokens')

async function commonBeforeAll() {
    await db.query(`DELETE FROM users`)

    await db.query(`DELETE FROM reviews`)

    await db.query(`DELETE FROM movies`)

    await User.register(
        {
            username: "testuser1",
            password: "password1",
            firstName: "First",
            lastName: "last",
            email: "test@user.com",
            bio: "nothin"
        }
    )

    await User.register(
        {
            username: "testuser2",
            password: "password1",
            firstName: "First",
            lastName: "last",
            email: "test2@user.com",
            bio: "nothin"
        }
    )

    await User.register(
        {
            username: "testuser3",
            password: "password1",
            firstName: "First",
            lastName: "last",
            email: "test3@user.com",
            bio: "nothin"
        }
    )

    await Movie.create({
        id: "tt0120595",
        title: "Babe: Pig in the City"
    })

    await Movie.create({
        id: "tt0407887",
        title: "The Departed"
    })

    await Movie.create({
        id: "tt0091474",
        title: "Manhunter"
    })

    await Movie.create({
        id: "tt0068646",
        title: "The Godfather"
    })

}

async function commonBeforeEach() {
    await db.query("BEGIN")
}

async function commonAfterEach() {
    await db.query("ROLLBACK")
}

async function commonAfterAll() {
    await db.end()
}

const u1Token = createToken({ username: "testuser1", id: 1})
const u2Token = createToken({ username: "testuser2", id: 2})

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token
}