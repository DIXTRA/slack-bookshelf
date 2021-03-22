// const commandsController = require('./commands.controller');
const userController = require('./user.controller');

const COMMANDS = {
  save: userController.savePost,
  list: userController.getPosts,
  help: userController.showHelp,
};

const COMMAND_NAMES = Object.keys(COMMANDS);

module.exports = {
  COMMANDS,
  COMMAND_NAMES,
};
