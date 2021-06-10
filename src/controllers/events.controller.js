const debug = require('debug')('slack-bookshelf:server');
const { User, ArticleTopic, Article, Topic } = require('../models');
const { getWebClient } = require('../helpers/slack.helper');
const { listApprovalRequests, noApprovalRequests, listSavedPosts } = require('../views/events.views');
const common = require('../views/common.views');

async function runEvent (req, res) {
  const { challenge } = req.body;

  // TODO: implement request verification https://api.slack.com/authentication/verifying-requests-from-slack

  if (challenge) { // validation url
    return res.status(200).json({ challenge });
  }

  const { team, user } = req;

  const teamTopics = await team.getTopics();

  let approvalRequestsBlocks = [], userPostsBlocks = [];

  if (user.isAdmin) {
    const approvalRequests = await ArticleTopic.findAll({
      where: { approved: false, TopicId: teamTopics.map((topic) => topic.id) },
      include: [
        { model: User, as: 'createdBy' },
        { model: Topic, as: 'topic' },
        { model: Article, as: 'article' },
      ],
    });

    if (approvalRequests.length > 0) {
      approvalRequestsBlocks = listApprovalRequests(approvalRequests || []);
    } else {
      approvalRequestsBlocks = noApprovalRequests();
    }
  }

  const userArticles = await user.getArticles();

  userPostsBlocks = listSavedPosts(userArticles);

  const webClient = getWebClient(team.token);

  await webClient.views.publish({
    user_id: user.slackId,
    view: {
      type: "home",
      blocks: [...approvalRequestsBlocks, ...userPostsBlocks],
    },
  });

  res.status(200);
}

module.exports = {
  runEvent,
}
