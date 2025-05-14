const router = require('express').Router();

const { User } = require('../Models/index.js');
const tokenExtractor = require('../util/tokenExtractor.js');
const userVerify = require('../util/userVerify.js');

const isAdmin = async (req, res, next) => {
  if (!req.user.admin) {
    return res.status(401).json({ error: 'operation not permitted' })
  }
  next()
}

/**
 * ROUTES
*/
router.put('/:username', tokenExtractor, userVerify, isAdmin, async (req, res) => {
  const user = await User.findOne({ 
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router