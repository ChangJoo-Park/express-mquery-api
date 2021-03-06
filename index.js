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
  const options = request.mquery

  User
    .get(options, (error, results) => {
      if (error) response.json(error)
      response.json(results)
    })
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

  User
    .signIn(email, password)
    .then((user) => response.json(user))
    .catch(e => response.status(500).json(e.message))
})

router.get('/posts/:post_id', (request, response, next) => {
  const {
    Post
  } = models
  Post.findById(request.params['post_id'])
    .populate('author')
    .populate('comments')
    .populate({
      path: 'comments.author',
      select: 'username email isAdmin'
    })
    .then(result => response.json(result))
    .catch(err => response.status(500).json(err))
})

router.post('/posts/:post_id/comments', async (request, response, next) => {
  const {
    Post
  } = models
  const {
    authorId: author,
    body
  } = request.body
  const p = await Post.findById(request.params['post_id'])

  p.addComment({
      author: {
        _id: author
      },
      body
    })
    .then(result => response.json(result))
    .catch(err => response.status(500).json(err))
})

router.get('/posts', (request, response, next) => {
  const {
    Post
  } = models
  const options = request.mquery

  Post
    .get(options, (error, results) => {
      if (error) response.json(error)
      response.json(results)
    })
})

router.post('/posts', (request, response, next) => {
  const {
    Post
  } = models
  const {
    authorId,
    title,
    body
  } = request.body

  Post.create(authorId, title, body)
    .then(result => response.json(result))
    .catch(err => response.status(500).json(err))
})

router.post('/comments', (request, response, next) => {
  const {
    Comment
  } = models

  const {
    authorId,
    postId,
    body
  } = request.body

  Comment.create(authorId, postId, body)
    .then(result => response.json(result))
    .catch(err => response.status(500).json(err))
})

app.use('/api/v1', router)

mongoose.connect('mongodb://localhost/myapp').then(_ => {
  console.log('connect to mongoDB Successfully')
})

app.listen(3000, _ => {
  console.log('listen https://localhost:3000 Successfully')
})
