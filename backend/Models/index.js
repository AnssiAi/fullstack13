const Note = require('./Note.js')
const Blog = require('./Blog.js')
const User = require('./User.js')

//Viiteavaimen määrittely
User.hasMany(Note);
User.hasMany(Blog);
Note.belongsTo(User);
Blog.belongsTo(User);

Note.sync({ alter: true });
Blog.sync({ alter: true });
User.sync({ alter:true });

module.exports = {
  Note,
  Blog,
  User
}