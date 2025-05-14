const jwt = require('jsonwebtoken');
const { SECRET } = require('./config.js');

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        console.log(authorization.substring(7))
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        req.auth = authorization.substring(7);
      } catch (error){
        console.log(error)
        return res.status(401).json({ error: 'token invalid' })
      }
    } else {
      return res.status(401).json({ error: 'token missing' })
    }
    next()
  }

  module.exports = tokenExtractor;