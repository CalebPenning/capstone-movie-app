const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { NotFoundError } = require('./expressError')

const authRoutes = require('./routes/auth')
const movieRoutes = require('./routes/movies')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))

app.use('/auth', authRoutes)
app.use('/movies', movieRoutes)
app.use('/reviews', reviewRoutes)
app.use('/users', userRoutes)


/**
 *  Handle 404 Errors - matches everything
 */
app.use((req, res, next) => (
    next(new NotFoundError())
))


/**
 *  Generic error handler
 *  any unhandled errors will end up here
 */
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'test') console.error(err.stack)
    const status = err.status || 500
    const message = err.message

    return res.status(status).json({error: { message, status }})
})

module.exports = app