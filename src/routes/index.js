const router = require('express').Router();
const { runCommand } = require('../controllers/commands.controller');
const { appInstall } = require('../controllers/auth.controller');
const { getTeam } = require('../middlewares/team.middleware');
const { getUser } = require('../middlewares/user.middleware');

const userRouter = require('./users');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/i18n_test', (req, res, ) => {
  res.json(res.__('Hola Mundo'));
})

// router.post('/commands', getTeam, getUser, runCommand);
router.post('/commands', runCommand);
router.get('/install', appInstall);

router.use(userRouter);

module.exports = router;
