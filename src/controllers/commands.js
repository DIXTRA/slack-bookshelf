// const commandsController = require('./commands.controller');
const userController = require('./user.controller');
const adminController = require('./admin.controller');

const COMMANDS = {
  save: userController.savePost,
  list: userController.getPosts,
  help: userController.showHelp,
  create_topic: adminController.addTopic,
};

const COMMAND_NAMES = Object.keys(COMMANDS);

module.exports = {
  COMMANDS,
  COMMAND_NAMES,
};
