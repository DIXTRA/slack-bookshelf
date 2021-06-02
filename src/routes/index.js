const router = require('express').Router();
const { runCommand } = require('../controllers/commands.controller');
const { runInteractive } = require('../controllers/interactive.controller');
const { runEvent } = require('../controllers/events.controller');
const { appInstall } = require('../controllers/auth.controller');
const { getTeamMiddleware } = require('../middlewares/team.middleware');
const { getUserMiddleware } = require('../middlewares/user.middleware');
const { getEventUserAndTeam } = require('../middlewares/events.middleware');

const userRouter = require('./users');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/i18n_test', (req, res, ) => {
  res.json(res.__('Hola Mundo'));
})

router.post('/commands', getTeamMiddleware, getUserMiddleware, runCommand);
router.post('/events', getEventUserAndTeam, runEvent);
router.get('/install', appInstall);
router.post('/interactive', runInteractive);

router.use(userRouter);

module.exports = router;
