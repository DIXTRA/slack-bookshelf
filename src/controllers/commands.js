// const commandsController = require('./commands.controller');
const userController = require('./user.controller');
const adminController = require('./admin.controller');
const workspaceController = require('./workspace.controller');

const COMMANDS = {
  save: userController.savePost,
  list: userController.getPosts,
  help: userController.showHelp,
  create_topic: adminController.addTopic,
  add: workspaceController.addPostToTopic,
};

const COMMAND_NAMES = Object.keys(COMMANDS);

module.exports = {
  COMMANDS,
  COMMAND_NAMES,
};
