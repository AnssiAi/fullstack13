const router = require('express').Router();
const { Op } = require('sequelize');
const { Blog, User } = require('../Models/index.js');
const { sequelize } = require('../util/db.js');
const tokenExtractor = require('../util/tokenExtractor.js');
const userVerify = require('../util/userVerify.js');


/**
 * MIDDLEWARE
 */
const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
  }

/**
 * ROUTES
 */
router.get('/', async (req, res) => {
    let where = {}

    if (req.query.search){
      where = { 
        [Op.or]: [
          {title: {
            [Op.iLike]: req.query.search ? req.query.search : ''
          }},
          {author: {
            [Op.iLike]: req.query.search ? req.query.search : ''
          }}
        ]
      }
    }
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId']},
      include:{
        model: User,
        attributes: ['name'],
      },
      where,
      order: [[sequelize.col('likes'), 'DESC']],
    });
    res.json(blogs);
  })
router.post('/', tokenExtractor, userVerify, async (req, res, next) => {
  try {
        const blog = await Blog.create({...req.body, userId: req.user.id});
        res.json(blog);
    } catch (error) {
        next(error);
    }
})
router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
      console.log(JSON.stringify(req.blog));
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
  })
router.put('/:id', blogFinder, async (req, res, next) => {
    if (req.blog){
      try {
          if (!req.body.likes){
            throw new Error('Missing parameters');
          }
          req.blog.likes = req.body.likes;
          await req.blog.save();
          res.json(req.blog);
      } catch (error) {
          next(error);
      }
    }else {
      res.status(404).end();
    } 
})
router.delete('/:id', tokenExtractor, userVerify, blogFinder, async (req, res, next) => {
    if (req.blog && req.decodedToken.id === req.blog.userId){
      try {
          await req.blog.destroy();
          res.status(200).end();
      } catch (error) {
          next(error);
      }
    }else {
      res.status(404).end();
    } 
})

module.exports = router;