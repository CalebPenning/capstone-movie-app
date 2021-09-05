const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))

app.use((req, res, next) => (
    next(new Error("oops"))
))

module.exports = app