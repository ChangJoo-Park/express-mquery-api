const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('./db')
const mquery = require('express-mquery')
const morgan = require('morgan')

const app = express()

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(mquery({
  limit: 10,
  maxLimit: 50
}))

mongoose.connect('mongodb://localhost/myapp').then(_ => {
  console.log('connect to mongoDB Successfully')
})

app.listen(3000, () => {
  console.log('listen https://localhost:3000 Successfully')
})
