const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router()

const { SECRET } = require('../util/config.js')
const User = require('../Models/User.js')
const Session = require('../Models/Session.js')

router.post('/', async (request, response) => {
  const {username, password} = request.body

  const user = await User.findOne({
    where: {
      username: username
    }
  })

  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disabled){
    return response.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  const date = new Date()
  const sessionDate = date.setHours(date.getHours() + 24);
  await Session.create({userId: user.id, token: token, validUntil: sessionDate})

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router