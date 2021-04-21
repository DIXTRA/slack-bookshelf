const { Article } = require('../models');

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
  const { text, team } = req;
  const commandParams = getCommandParams(text, 2);

  try {
    if (!commandParams) throw new Error('Wrong number of params');
    const [topicName, postUrl] = commandParams;

    const hasTopic = await topicExists(topicName, team.id);

    if (!hasTopic) throw new Error(`Topic '${topicName}' not found`);

    let post = await Article.findOne({ where: { url: postUrl } });

    if (!post) {
      const info = await getInfo(postUrl);
      debug('INFO:', { info });
      if (!info) throw new Error('Error fetching post');

      const {
        name,
        description,
        image,
        author: { name: authorName },
        keywords,
      } = info;

      post = await Article.create({
        title: name,
        url: postUrl,
        description,
        image: image[0],
        author: authorName,
        keywords: keywords.join(','),
      });
    }

    if (!post) throw new Error('Error creating post');

    res.renderBlocks([plainText('Article added successfully to topic')]);
  } catch (e) {
    debug(e);
    res.renderSlack(commonViews.commandError(e.message));
  }
}

module.exports = { addPostToTopic };
