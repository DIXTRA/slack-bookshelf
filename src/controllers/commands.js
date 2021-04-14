// const commandsController = require('./commands.controller');
const userController = require('./user.controller');
const adminController = require('./admin.controller');

const COMMANDS = {
  save: userController.savePost,
  saved: userController.getUserSavedPosts,
  help: userController.showHelp,
  create_topic: adminController.addTopic,
};

const COMMAND_NAMES = Object.keys(COMMANDS);

module.exports = {
  COMMANDS,
  COMMAND_NAMES,
};
