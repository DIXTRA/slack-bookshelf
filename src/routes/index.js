const userRouter = require('./users');
const router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use(userRouter);

module.exports = router;
