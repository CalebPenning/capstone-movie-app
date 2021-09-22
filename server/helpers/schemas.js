const { BadRequestError } = require('../expressError')
const jsonschema = require('jsonschema')

function validateData(req, schema) {
    const validator = jsonschema.validate(req.body, schema)
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack)
        console.log(`IM ERRORS: ${errs}`)
        throw new BadRequestError(errs)
    }
    return true
}

module.exports = validateData