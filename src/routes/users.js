const router = require('express').Router();
const middleware = require('../middlewares/user.middleware');
const controller = require('../controllers/user.controller');

router.post('/users', middleware.getUser, controller.getPosts);

module.exports = router;
