const Note = require('./Note.js')
const Blog = require('./Blog.js')
const User = require('./User.js')

//Viiteavaimen määrittely
User.hasMany(Note);
User.hasMany(Blog);
Note.belongsTo(User);
Blog.belongsTo(User);

module.exports = {
  Note,
  Blog,
  User
}