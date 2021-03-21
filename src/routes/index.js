const userRouter = require('./users');
const router = require('express').Router();

const commands = require('../controllers/commands.controller')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', commands.runCommand)

router.use(userRouter);

module.exports = router;
