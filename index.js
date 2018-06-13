const express = require('express')
const bodyParser = require('body-parser')
const mquery = require('express-mquery')
const morgan = require('morgan')
const mongoose = require('./db')
const models = require('./models')
const router = express.Router()
const app = express()

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(mquery({
  limit: 10,
  maxLimit: 50
}))

// Set Routes
router.get('/users', (request, response, next) => {
  const {
    User
  } = models
  // const options = request.mquery

  User.find().then((error, results) => {
    if (error) response.json(error)
    response.json(results)
  })
  // .get(options, (error, results) => {
  //   if (error) response.json(error)
  //   response.json(results)
  // })
})

router.post('/signup', async (request, response, next) => {
  const {
    User
  } = models
  const {
    username,
    email,
    password
  } = request.body
  try {
    const result = await User.signUp(username, email, password)
    response.json(result)
  } catch (error) {
    response.status(500).json(error)
  }
})

router.post('/signin', async (request, response, next) => {
  const {
    User
  } = models
  const {
    email,
    password
  } = request.body
  User.signIn(email, password).then((user) => {
    response.json(user)
  })
})

app.use('/api/v1', router)

mongoose.connect('mongodb://localhost/myapp').then(_ => {
  console.log('connect to mongoDB Successfully')
})

app.listen(3000, _ => {
  console.log('listen https://localhost:3000 Successfully')
})
