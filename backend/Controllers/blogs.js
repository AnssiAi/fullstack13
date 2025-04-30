const router = require('express').Router();
const { Blog } = require('../Models/index.js');

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
    const blogs = await Blog.findAll();
    res.json(blogs);
  })
router.post('/', async (req, res) => {
  try {
        const blog = await Blog.create(req.body);
        res.json(blog);
    } catch (error) {
        res.status(400).json({error});
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
router.put('/:id', blogFinder, async (req, res) => {
    if (req.blog){
      try {
          req.blog.likes = req.body.likes;
          await req.blog.save();
          res.json(req.blog);
      } catch (error) {
          res.status(400).json({error});
      }
    }else {
      res.status(404).end();
    } 
})
router.delete('/:id', blogFinder, async (req, res) => {
    if (req.blog){
      try {
          await req.blog.destroy();
          res.status(200).end();
      } catch (error) {
          res.status(400).json({error});
      }
    }else {
      res.status(404).end();
    } 
})

module.exports = router;