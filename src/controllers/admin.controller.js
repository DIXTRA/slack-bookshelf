/*
  Controller para acciones de los admins (crear topics, aprobar posts, etc)
*/
const commonViews = require('../views/common.views');

function listTopicLinks(res, req) {
  const topic = req.topic;
  const articleList = req.articleList;
  const result = articleList.filter((article) => article.topic == topic);

  res.send(`Listing ${result} posts with that topic`);
  res.renderBlocks(commonViews.listTopicLinks());
}

module.exports = { listTopicLinks };
