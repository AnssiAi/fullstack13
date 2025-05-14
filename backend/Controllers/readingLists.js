const router = require('express').Router();

const { sequelize } = require('../util/db.js');
const { ReadList } = require('../Models/index.js');
const tokenExtractor = require('../util/tokenExtractor.js');
const userVerify = require('../util/userVerify.js');

/**
 * MIDDLEWARE
 */
const listFinder = async (req, res, next) => {
    req.list = await ReadList.findByPk(req.params.id)
    next()
  }

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

router.put('/:id', tokenExtractor, userVerify, listFinder, async (req, res, next) => {
    if(req.list && req.decodedToken.id === req.list.userId){
        try {
            req.list.isRead = req.body.read;
            await req.list.save()
            
            res.json(req.list);
        } catch (error) {
            next(error)
        }
    } else {
        res.status(404).end();
    }
})

module.exports = router