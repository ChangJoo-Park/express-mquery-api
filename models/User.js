const mongoose = require('../db')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  bio: String,
  image: String
}, {
  timestamps: true
})

UserSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', UserSchema)
