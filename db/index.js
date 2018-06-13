const mongoose = require('mongoose')
const restActions = require('mongoose-rest-actions')

mongoose.plugin(restActions)

module.exports = mongoose
