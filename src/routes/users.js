const router = require('express').Router();
const middleware = require('../middlewares/user.middleware');
const controller = require('../controllers/user.controller');

/* GET users listing. */
router.get('/users', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/users', middleware.getUser, controller.getPosts);

module.exports = router;
