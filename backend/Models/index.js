const Note = require('./Note.js')
const Blog = require('./Blog.js')
const User = require('./User.js')

//Viiteavaimen määrittely
User.hasMany(Note);
Note.belongsTo(User);

Note.sync({ alter: true });
Blog.sync();
User.sync({ alter:true });

module.exports = {
  Note,
  Blog,
  User
}