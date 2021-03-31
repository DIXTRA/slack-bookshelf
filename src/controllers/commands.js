// const commandsController = require('./commands.controller');
const userController = require('./user.controller');
const adminController = require('./admin.controller');

const COMMANDS = {
  save: userController.savePost,
  list: userController.getPosts,
  help: userController.showHelp,
  listTopicLinks: adminController.listTopicLinks,
};

const COMMAND_NAMES = Object.keys(COMMANDS);

module.exports = {
  COMMANDS,
  COMMAND_NAMES,
};
