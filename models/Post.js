const mongoose = require('../db')

const Schema = mongoose.Schema

const Comment = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: 'Comment author cannot be blank'
  },

  body: {
    type: String,
    trim: true,
    required: 'Comment body cannot be blank'
  }
}, {
  timestamps: true
})

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: 'Post author cannot be blank'
  },

  title: {
    type: String,
    trim: true,
    required: 'Post title cannot be blank'
  },

  body: {
    type: String,
    trim: true,
    required: 'Post body cannot be blank'
  },

  comments: [Comment],

  tags: {
    type: [],
    get: tags => tags.join(','),
    set: tags => tags.split(',')
  }
}, {
  timestamps: true
})

/**
 * Methods
 */
postSchema.methods = {
  addComment ({
    author: {
      _id: author
    },
    body
  }) {
    console.log('author => ', author)
    console.log('body => ', body)
    this.comments.push({
      author,
      body
    })

    return this.save()
  }
}

postSchema.statics = {
  async create (authorId, title, body) {
    const User = require('./User')
    const Post = this
    return User.findById(authorId)
      .then(author => {
        const newPost = new Post({
          author,
          title,
          body
        })
        return newPost.save()
      })
  }
}
module.exports = mongoose.model('Post', postSchema)
