const router = require('express').Router();

const { sequelize } = require('../util/db.js');
const { Blog } = require('../Models/index.js');

/**
 * ROUTES
*/
router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: ['author', [sequelize.fn('COUNT', sequelize.col('author')), 'blogs'], [sequelize.fn('SUM', sequelize.col('likes')), 'likes']],
    group: [['author']]
  })

  res.json(authors)
})

module.exports = router