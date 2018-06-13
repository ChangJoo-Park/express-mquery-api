const express = require('express')
const bodyParser = require('body-parser')
const mquery = require('express-mquery')
const morgan = require('morgan')
const mongoose = require('./db')
const models = require('./models')
const app = express()

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(mquery({
  limit: 10,
  maxLimit: 50
}))

// Set Routes
app.get('/api/users', (request, response, next) => {
  const {
    User
  } = models
  const options = request.mquery
  User
    .get(options, (error, results) => {
      if (error) response.json(error)
      response.json(results)
    })
})

mongoose.connect('mongodb://localhost/myapp').then(_ => {
  console.log('connect to mongoDB Successfully')
})

app.listen(3000, () => {
  console.log('listen https://localhost:3000 Successfully')
})
