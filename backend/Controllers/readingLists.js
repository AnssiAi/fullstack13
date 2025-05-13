const router = require('express').Router();

const { sequelize } = require('../util/db.js');
const { ReadList } = require('../Models/index.js');

/**
 * ROUTES
*/
router.post('/', async (req, res, next) => {
  try {
    const list = await ReadList.create(req.body);

    res.json(list);
  } catch (error) {
    next(error)
  }
})

module.exports = router