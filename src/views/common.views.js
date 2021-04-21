const blocks = require('./blocks.views');
const { slackCommand } = require('../utils/constants');
const { COMMANDS } = require('../controllers/commands');
const debug = require('debug')('slack-bookshelf:server');

/*
  Demo de mensaje de error 
*/
function commandError(message) {
  return blocks.base([
    blocks.plainText('Oops!', 'header'),
    blocks.plainText(message),
  ]);
}

/*
  Demo de listar posts
*/
function listPosts(posts = []) {
  return blocks.base(posts.map((post, i) => blocks.plainText(post)));
}

function showHelp(req, res, withError = false) {
  debug("show help common views");
  const arrayHelpCommands = Object.entries(res.__("help_commands"));
  debug(arrayHelpCommands);
  arrayHelpCommands.map(item =>{
    debug(item.keys, item.values);
  })
}

module.exports = {
  listPosts,
  commandError,
  showHelp,
};
