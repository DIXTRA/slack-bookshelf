const blocks = require('./blocks.views');
const common = require('./common.views');
const debug = require('debug')('slack-bookshelf:server');
const { Article, User } = require('../models');

async function listTopicArticles(req, articlesTopic = [], actions = []) {
  const articlesView = await Promise.all(
    articlesTopic.map(async (articleTopic) => {
      let article = await Article.findOne({
        where: { id: articleTopic.ArticleId },
      });
      let user = await User.findOne({
        where: { id: articleTopic.createdBy },
      });
      return renderAticle(req, article, actions, user);
    })
  );

  return [
    blocks.header(req.__('topics.listing_articles_title')),
    blocks.divider(),
    ...articlesView,
  ];
}

function renderAticle(req, article, actions = [], user) {
  let userName = blocks.markdown(user?.displayName);
  let userImage = blocks.image(
    'https://api.slack.com/img/blocks/bkb_template_images/profile_3.png'
  );
  let articleBody = blocks.markdown(
    `<${article.url}|${article.title}>\n${article.description}`
  );
  let articleImage = blocks.image(article.image);
  let articleActions = actions.length
    ? [
        blocks.actions(
          actions.map((action) =>
            blocks.action(
              blocks.plainText(action.text),
              article.id,
              action.actionId,
              action.style
            )
          )
        ),
      ]
    : [];

  return [
    ...(user
      ? [
          blocks.context([
            blocks.markdown(req.__('articles.submitted_by')),
            userImage,
            userName,
          ]),
        ]
      : []),
    blocks.sectionWithImage(articleBody, articleImage),
    ...articleActions,
    blocks.divider(),
  ];
}

module.exports = { listTopicArticles };
