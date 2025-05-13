const Note = require('./Note.js')
const Blog = require('./Blog.js')
const User = require('./User.js')
const Team = require('./Team.js')
const Membership = require('./Membership.js')
const UserNotes = require('./UserNote.js')
const ReadList = require('./ReadList.js')

//Viiteavaimen määrittely
User.hasMany(Note);
User.hasMany(Blog);
Note.belongsTo(User);
Blog.belongsTo(User);

User.belongsToMany(Team, { through: Membership }) //liitostaulu
Team.belongsToMany(User, { through: Membership })

User.belongsToMany(Note, { through: UserNotes, as: 'markedNotes'}) //Alias määrittely liitokselle
Note.belongsToMany(User, { through: UserNotes, as: 'usersMarked'})

User.belongsToMany(Blog, {through: ReadList, as: 'readings'})
Blog.belongsToMany(User, {through: ReadList, as: 'markedToRead'})

module.exports = {
  Note,
  Blog,
  User,
  Team,
  Membership,
  UserNotes,
  ReadList
}