const router = require('express').Router();
const { Blog, User } = require('../Models/index.js');
const tokenExtractor = require('../util/tokenExtractor.js');

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
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId']},
      include:{
        model: User,
        attributes: ['name'],
      }
    });
    res.json(blogs);
  })
router.post('/', tokenExtractor, async (req, res, next) => {
  try {
        const user = await User.findByPk(req.decodedToken.id);
        const blog = await Blog.create({...req.body, userId: user.id});
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
router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
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