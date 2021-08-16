const { Topic, ArticleTopic, User, Article } = require('../models');
const commonViews = require('../views/common.views');
const articlesViews = require('../views/articles.views');
const blocksViews = require('../views/blocks.views');
const { topicExists } = require('../helpers/topics.helper');
const { getCommandParams } = require('../helpers/commands.helper');
const { validName } = require('../helpers/common.helper');
const { addAppMetadata } = require('@slack/web-api');
const { ActionType } = require('../enum/action_type');

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
        const message = blocksViews.block(
          blocksViews.plainText(req.__('topics.create_success', { name }))
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

    // get approved articleTopics (move to method?)
    const articleTopics = await ArticleTopic.findAll({
      where: { TopicId: topic.id, approved: true },
      include: [
        { model: User, as: 'createdBy' },
        { model: Article, as: 'article' },
      ],
    });

    if (!articleTopics.length)
      res.send(`*${req.__('topics.empty_message', { name })}*`);
    else {
      const viewBlocks = articlesViews.listTopicArticles(
        req,
        name,
        articleTopics
      );
      res.renderBlocks(viewBlocks, true);
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
    if (!topic) {
      throw new Error(
        req.__('errors.topic_not_found_error', { name: topicName })
      );
    }
    const articleTopics = await ArticleTopic.findAll({
      where: { TopicId: topic.id, approved: true },
      include: [
        { model: User, as: 'createdBy' },
        { model: Article, as: 'article' },
      ],
    });

    if (articleTopics.length) {
      const isAdmin = !!req?.user?.isAdmin;
      const articlesView = articleTopics.map(({ id, article, createdBy }) =>{
        let actions = isAdmin ? [
          blocksViews.action(req.__('commons.remove'), id, ActionType.ListRemoveArticleTopic, "danger")
        ]: [];
        return articlesViews.renderArticle(req, article, actions, createdBy,);
      });
      res.renderBlocks( [
        blocksViews.header(req.__('topics.listing_articles_title', { name: topicName })),
        blocksViews.divider(),
        ...articlesView.flat(),
      ]);
    } else {
      throw new Error(req.__('errors.list_posts_error'));
    }
  } catch (e) {
    res.renderSlack(commonViews.commandError(e.message));
  }
}

async function removeTopicLink(req, res) {
  const { text, team, user } = req;
  const commandParams = getCommandParams(text, 2);

  try {
    if (!user.isAdmin) {
      throw new Error(req.__('errors.admin_only_error'));
    }
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

    const post = await Article.findOne({ where: { url: postUrl } });

    if (!post) {
      throw new Error(req.__('errors.get_post_info_error'));
    }

    await ArticleTopic.deleteOne({
      where: { TopicId: topic.id, ArticleId: post.id },
    });

    res.renderBlocks([plainText(req.__('articles.remove_to_topic_success'))]);
  } catch (e) {
    debug(e);
    res.renderSlack(commonViews.commandError(e.message));
  }
}

module.exports = { addTopic, listTopicLinks, removeTopicLink, shareTopic };
