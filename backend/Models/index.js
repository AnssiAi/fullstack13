const Note = require('./Note.js')
const Blog = require('./Blog.js')

Note.sync();
Blog.sync();

module.exports = {
  Note,
  Blog
}