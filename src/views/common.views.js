const blocks = require('./blocks.views');
const { slackCommand } = require('../utils/constants');

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

function showHelp(withError = false) {
  const items = [
    `\`${slackCommand} help\`: Show this message`,
    `\`${slackCommand} list\`: List saved posts`,
  ];

  return items.map((item) => blocks.markdown(item));
}

function listTopicLinks(posts) {
  return posts.map((post) => blocks.plainText(post.link));
}

function getTopics(topics) {
  return topics.map((topic) => blocks.plainText(topic));
}

module.exports = {
  listPosts,
  commandError,
  showHelp,
  listTopicLinks,
  getTopics,
};
