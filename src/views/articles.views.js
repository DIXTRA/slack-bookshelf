const blocks = require('./blocks.views');
const common = require('./common.views');
const debug = require('debug')('slack-bookshelf:server');
const { Article, User } = require('../models');

async function listTopicArticles(req, articlesTopic = [], actions= []) {
  const articlesView = await Promise.all(articlesTopic.map(async (articleTopic) => {
    let article = await Article.findOne({
      where: { id: articleTopic.ArticleId },
    });
    let user = await User.findOne({
      where: { id: articleTopic.createdBy },
    });
    return renderAticle(req, article, actions, user);
  }));
  return [].concat.apply([], articlesView);
}

function renderAticle(req, article, actions = [], user){
  return [
    ...((user) ? [blocks.context([blocks.markdown(req.__('articles.submitted_by')), blocks.image('https://api.slack.com/img/blocks/bkb_template_images/profile_3.png'), blocks.markdown(user.displayName)])] : []),
    blocks.sectionWithImage(
      blocks.markdown( `<${article.url}|${article.title}>\n${article.description}`), 
      blocks.image(article.image)
    ),
    ...((actions.length > 0) ? [blocks.actions(actions.map((action) => blocks.action(blocks.plainText(action.text), article.id, action.actionId, action.style)))] : []),
    blocks.divider()
  ];
}

module.exports = {listTopicArticles};
