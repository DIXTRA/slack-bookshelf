const { Article, Topic, ArticleTopic } = require('../models');

const { getCommandParams } = require('../helpers/commands.helper');
const { topicExists } = require('../helpers/topics.helper');
const { getInfo } = require('../helpers/medium.helper');

const { plainText, block } = require('../views/blocks.views');
const commonViews = require('../views/common.views');
const { saveTopicArticleJob } = require('../jobs/articles/articleJobs');

const debug = require('debug')('slack-bookshelf:server');

/*
  Acciones de usuarios dentro del workspace:
    * Agregar posts
    * ver topics
    * etc..
*/

async function addPostToTopic(req, res) {
  const { text, team, user } = req;
  const responseUrl = req.body.response_url;
  const commandParams = getCommandParams(text, 2);

  try {
    if (!commandParams)
      throw new Error(req.__('errors.number_of_params_error'));
    const [topicName, postUrl] = commandParams;

    const topic = await Topic.findOne({
      where: { name: topicName, TeamId: team.id },
    });

    if (!topic)
      throw new Error(
        req.__('errors.topic_not_found_error', { name: topicName })
      );

    let post = await Article.findOne({ where: { url: postUrl } });

    if (!post) {
      saveTopicArticleJob(postUrl, user.id, topic.id, { locale: 'en', responseUrl });

      return res.renderBlocks([block(plainText(req.__('articles.processing_article')))]);
    } else {
      let articleTopic = await ArticleTopic.findOne({ where: { TopicId: topic.id, ArticleId: post.id, } });

      if (articleTopic) {
        return res.renderBlocks([block(plainText(req.__('articles.add_to_topic_success')))]);
      }
    }

    if (!post) throw new Error(req.__('errors.create_post_error'));

    await ArticleTopic.create({
      CreatedById: user.id,
      TopicId: topic.id,
      ArticleId: post.id,
    });

    res.renderBlocks([block(plainText(req.__('articles.add_to_topic_success')))]);
  } catch (e) {
    debug(e);
    res.renderSlack(commonViews.commandError(e.message));
  }
}

module.exports = { addPostToTopic };
