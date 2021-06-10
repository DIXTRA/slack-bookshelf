const { Article, Topic, ArticleTopic } = require('../models');
const commonViews = require('../views/common.views');
const blocksViews = require('../views/blocks.views');
const { topicExists } = require('../helpers/topics.helper');
const { getCommandParams } = require('../helpers/commands.helper');
const { validName } = require('../helpers/common.helper');
const { addAppMetadata } = require('@slack/web-api');

const debug = require('debug')('slack-bookshelf:server');

/*
  Controller para acciones de los admins (crear topics, aprobar posts, etc)
*/

// control access to admins only
function adminOnlyError(req, res) {
  const isAdmin = !!req?.user?.isAdmin;

  if (!isAdmin)
    res.renderSlack(
      commonViews.commandError(req.__('errors.admin_only_error'))
    );

  return !isAdmin;
}

async function addTopic(req, res) {
  const { text: name, team, user } = req;

  if (adminOnlyError(req, res)) return;

  if (validName(name)) {
    const alreadyCreated = await topicExists(name, team.id);

    if (alreadyCreated) {
      res.renderSlack(
        commonViews.commandError(
          req.__('errors.topic_already_created_error', { name })
        )
      );
    } else {
      const newTopic = await team.createTopic({ name, createdBy: user.id });

      if (newTopic) {
        const message = blocksViews.plainText(
          req.__('topics.create_success', { name })
        );

        res.renderBlocks([message], true);
      } else
        res.renderSlack(
          commonViews.commandError(
            req.__('errors.create_topic_error', { name })
          )
        );
    }
  } else {
    res.renderSlack(
      commonViews.commandError(
        req.__('errors.invalid_topic_name_error', { name })
      )
    );
  }
}

async function shareTopic(req, res) {
  const { text: name, team, user } = req;

  if (adminOnlyError(req, res)) return;

  // const commandParams = getCommandParams(text, 1);
  try {
    const topic = await Topic.findOne({ where: { name, TeamId: team.id } });

    if (!topic)
      throw new Error(req.__('errors.topic_not_found_error', { name }));

    const articles = await topic.getArticles();
    debug(articles);

    if (!articles.length) res.send(`*Topic '${name}' is empty*`);
    else {
      const msg = articles.map((a) => a.url);
      res.send('*Listing posts*\n' + msg.join(', \n'));
    }
  } catch (e) {
    debug(e);
    res.renderSlack(commonViews.commandError(e.message));
  }
}

async function listTopicLinks(req, res) {
  const { text, team } = req;

  try {
    const commandParams = getCommandParams(text, 1);
    if (!commandParams)
      throw new Error(req.__('errors.number_of_params_error'));
    const topicName = commandParams[0];
    const topic = await Topic.findOne({
      where: { name: topicName, TeamId: team.id },
    });
    if (!topic)
      throw new Error(
        req.__('errors.topic_not_found_error', { name: topicName })
      );
    const result = await topic.getArticles();
    if (result.length > 0) {
      throw new Error(req.__('errors.list_posts_error'));
    } else {
      res.renderBlocks(commonViews.listTopicLinks(result));
    }
  } catch (e) {
    res.renderSlack(commonViews.commandError(e.message));
  }
}

module.exports = { addTopic, listTopicLinks, shareTopic };
