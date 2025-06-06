const bcrypt = require('bcrypt');
const router = require('express').Router();
const { Op } = require('sequelize');

const { User, Note, Blog, Team } = require('../Models/index.js');
const tokenExtractor = require('../util/tokenExtractor.js');
const userVerify = require('../util/userVerify.js');

/**
 * ROUTES
*/
router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash']},
    include: [{
        model: Note,
        attributes: { exclude: ['userId']}
    },
    {
        model: Note,
        as: 'markedNotes',
        attributes: { exclude: ['userId']},
        include: {
          model: User,
          attributes: ['name']
        },
        through: {
          attributes: []
        }
    },
    {
      model: Blog,
      attributes: { exclude: ['userId']}
    },
    {
      model: Team,
      attributes: ['name', 'id'],
      through: {
        attributes: []
      }
    }
  ],
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const where = { id: req.params.id };
  const throughWhere = {}
  
  if (req.query.read){
    const bool = req.query.read === 'true' ? true : false;
    throughWhere.isRead = {[Op.is]: bool};
  }
  
  const user = await User.findOne({ 
    where,
    attributes: { exclude: ['passwordHash']},
    include: [{
      model: Blog,
      as: 'readings',
      through: {
        attributes: ['isRead', 'id'],
        where: throughWhere
      },
    }],
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', tokenExtractor, userVerify, async (req, res, next) => {
    try {
      const user = await User.findOne({where: { username: req.params.username}});
      user.name = req.body.name;
      await user.save();
      res.json(user)
    } catch(error) {
        next(error);
    }
  })

router.post('/', async (req, res, next) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(req.body.password, saltRounds);
  try {
    const user = await User.create({...req.body, passwordHash: passwordHash})
    res.json(user)
  } catch(error) {
    next(error);
  }
})

module.exports = router