const router = require('express').Router();
const { Note } = require('../Models/index.js');

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
    const notes = await Note.findAll();
    console.log(JSON.stringify(notes, null, 2))
    res.json(notes);
})
router.post('/', async (req, res) => {
    try {
        const note = await Note.create(req.body);
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