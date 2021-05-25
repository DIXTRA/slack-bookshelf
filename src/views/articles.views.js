const blocks = require('./blocks.views');
const common = require('./common.views');
const debug = require('debug')('slack-bookshelf:server');

function listTopicArticles(topicName, articles = []) {
  const articlesView = articles.map((article) => {});
  const viewBlocks = [
    blocks.markdown(`*${topicName}*`),
    blocks.divider(),
    ...articlesView,
  ];
}

module.exports = {};
