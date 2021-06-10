const blocks = require('./blocks.views');
const common = require('./common.views');
const debug = require('debug')('slack-bookshelf:server');

function listTopicArticles(topicName, articles = []) {
  const articlesView = articles.map((article) => renderAticle(article));
  return [].concat.apply([], articlesView);
  /*
  const viewBlocks = [
    blocks.markdown(`*${topicName}*`),
    blocks.divider(),
    ...articlesView,
  ];
  */
}

function renderAticle(article, ){
  return [
    blocks.sectionWithImage(blocks.markdown( `<${article.url}|${article.title}>\n${article.description}`), blocks.image(article.image))
  ]
}

function renderAticleSDmy(article, ){
  return [
    blocks.sectionWithImage(`<${article.url}|${article.title}\n${article.description}>`, article.image)
  ]
}

module.exports = {listTopicArticles};
