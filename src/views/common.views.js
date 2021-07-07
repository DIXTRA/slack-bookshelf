const blocks = require('./blocks.views');
const { slackCommand } = require('../utils/constants');
const { COMMANDS } = require('../controllers/commands');
const debug = require('debug')('slack-bookshelf:server');

/*
  Demo de mensaje de error 
*/
function commandError(message) {
  console.log(message);
  return blocks.base([
    blocks.block(blocks.plainText('Oops!'), 'header'),
    blocks.block(blocks.plainText(message)),
  ]);
}

/*
  Demo de listar posts
*/
function listPosts(posts = []) {
  return blocks.base(posts.map((post, i) => blocks.block(blocks.plainText(post.title))));
}

function showHelp(arrayHelpCommands, errorMessage, withError = false) {
  const blockList = arrayHelpCommands.map(([key, value]) =>{
    return `\`${slackCommand} ${key}\`: ${value}`;
  });
  if(withError){
    blockList.unshift(errorMessage);
  }
  return [blocks.block(blocks.markdown(blockList.join('\n')))];
}

function listTopicLinks(posts) {
  return posts.map((post) => blocks.block(blocks.plainText(post.url)));
}

function getTopics(topics) {
  return topics.map((topic) => blocks.block(blocks.plainText(topic.name)));
}

module.exports = {
  listPosts,
  commandError,
  showHelp,
  listTopicLinks,
  getTopics,
};
