const userController = require('./user.controller');

const COMMANDS = {
  save: userController.savePost,
  list: userController.list,
};

const COMMAND_NAMES = Object.keys(COMMANDS);

module.exports = {
  COMMANDS,
  COMMAND_NAMES,
};
