// const commandsController = require('./commands.controller');
const userController = require('./user.controller');
const adminController = require('./admin.controller');
const workspaceController = require('./workspace.controller');

const COMMANDS = {
  save: userController.savePost,
  saved: userController.getUserSavedPosts,
  help: userController.showHelp,
  topics: userController.getTopics,
  list: adminController.listTopicLinks,
  create_topic: adminController.addTopic,
  add: workspaceController.addPostToTopic,
  share: adminController.shareTopic,
};

const COMMAND_NAMES = Object.keys(COMMANDS);

module.exports = {
  COMMANDS,
  COMMAND_NAMES,
};
