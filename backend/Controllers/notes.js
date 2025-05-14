const router = require('express').Router();
const { Op } = require('sequelize');
const { Note, User } = require('../Models/index.js');
const tokenExtractor = require('../util/tokenExtractor.js');
const userVerify = require('../util/userVerify.js');

/**
 * MIDDLEWARE
 */

const noteFinder = async (req, res, next) => {
    req.note = await Note.findByPk(req.params.id)
    next()
  }

/**
 * ROUTES
 */
router.get('/', async (req, res) => {
    const where = {};
    
    if (req.query.important){
      where.important = req.query.important === 'true'
    }
    if (req.query.search){
      where.content = {
          [Op.substring]: req.query.search ? req.query.search : ''
        }
    }
    const notes = await Note.findAll({
      attributes: { exclude: ['userId']},
      include:[{
        model: User,
        attributes: ['name'],
      },
      {
        model: User,
        as: 'usersMarked',
        attributes: ['name'],
        through: {
          attributes: []
        }
      }
      ],
      where
    });
    console.log(JSON.stringify(notes, null, 2))
    res.json(notes);
})
router.post('/', tokenExtractor, userVerify, async (req, res) => {
    try {
        const note = await Note.create({...req.body, userId: req.user.id, date: new Date()});
        res.json(note);
    } catch (error) {
        res.status(400).json({error});
    }
})
router.get('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    console.log(JSON.stringify(req.note));
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})
router.put('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    req.note.important = req.body.important
    await req.note.save()
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})
router.delete('/:id', noteFinder, async (req, res) => {
    if (req.note){
      try {
          await req.note.destroy();
          res.status(200).end();
      } catch (error) {
          res.status(400).json({error});
      }
    }else {
      res.status(404).end();
    } 
})

module.exports = router;