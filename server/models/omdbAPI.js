const { baseUrl } = require('../secrets')
const axios = require('axios')

class omdbAPI {
    static async getInfo(movieID) {
        let res = await axios.get(`${baseUrl}i=${movieID}`)
        return res.data
    }
}

module.exports = omdbAPI