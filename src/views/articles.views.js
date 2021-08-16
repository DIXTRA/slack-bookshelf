const blocks = require('./blocks.views');
const common = require('./common.views');
const debug = require('debug')('slack-bookshelf:server');

function listTopicArticles(req, topicName, articlesTopic = [], actions = []) {
  const articlesView = articlesTopic.map(({ article, createdBy }) =>
    renderArticle(req, article, actions, createdBy)
  );
  return [
    blocks.header(req.__('topics.listing_articles_title', { name: topicName })),
    blocks.divider(),
    ...articlesView.flat(),
  ];
}

function listArticles(req, articlesTopic = [], actions = []) {
  const articlesView = articlesTopic.map((article) =>
    renderArticle(req, article, actions)
  );
  return [...articlesView.flat()];
}

function renderArticle(req, article, actions = [], user, textHeaderActions) {
  let userName = blocks.markdown(user?.displayName);
  let userImage = blocks.image(user?.profilePicture);
  let articleBody = blocks.markdown(
    `<${article.url}|${article.title}>\n${article.description}`
  );
  let articleImage = blocks.image(article.image);
  let headerActions = textHeaderActions != null
    ? [
        blocks.section(
          blocks.markdown(textHeaderActions)
        ),
      ]
    : [];
  let articleActions = actions.length
    ? [
        blocks.actions(
          actions.map((action) =>
            blocks.action(
              blocks.plainText(action.text),
              action.value ?? article.id,
              action.action_id,
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
    ...headerActions.flat(),
    ...articleActions.flat(),
    blocks.divider(),
  ];
}

module.exports = { listTopicArticles, listArticles, renderArticle };
