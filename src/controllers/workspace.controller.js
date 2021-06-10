const { Article, Topic, ArticleTopic } = require('../models');

const { getCommandParams } = require('../helpers/commands.helper');
const { topicExists } = require('../helpers/topics.helper');
const { getInfo } = require('../helpers/medium.helper');

const { plainText } = require('../views/blocks.views');
const commonViews = require('../views/common.views');

const debug = require('debug')('slack-bookshelf:server');

/*
  Acciones de usuarios dentro del workspace:
    * Agregar posts
    * ver topics
    * etc..
*/

async function addPostToTopic(req, res) {
  const { text, team, user } = req;
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
      const postInfo = await getInfo(postUrl);
      debug('INFO:', { info });

      if (!postInfo) throw new Error(req.__('errors.get_post_info_error'));

      const { name, description, image, authorName, keywords } = postInfo;

      post = await Article.create({
        title: name,
        url: postUrl,
        description,
        image: image[0],
        author: authorName,
        keywords: keywords.join(','),
      });
    }

    if (!post) throw new Error(req.__('errors.create_post_error'));

    await ArticleTopic.create({
      CreatedById: user.id,
      TopicId: topic.id,
      ArticleId: post.id,
    });

    res.renderBlocks([plainText(req.__('articles.add_to_topic_success'))]);
  } catch (e) {
    debug(e);
    res.renderSlack(commonViews.commandError(e.message));
  }
}

module.exports = { addPostToTopic };
