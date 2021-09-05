const { Client } = require('pg')
const { getDbUri } = require('./config')

let db 

if (process.env.NODE_ENV === 'production') {
    db = new Client({
        connectionString: getDbUri(),
        ssl: {
            rejectUnauthorized: false
        }
    })
} else db = new Client({ connectionString: getDbUri() })

db.connect()

module.exports = db