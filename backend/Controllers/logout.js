const router = require('express').Router()
const tokenExtractor = require('../util/tokenExtractor.js')
const Session = require('../Models/Session.js')

router.post('/',tokenExtractor, async (req, res, next) => {
  if(req.decodedToken && req.auth){
    try {
      const session = await Session.findOne({ where: { userId: req.decodedToken.id, token: req.auth}})
      await session.destroy();
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  } else {
    res.status(404).end();
  }
}) 

module.exports = router