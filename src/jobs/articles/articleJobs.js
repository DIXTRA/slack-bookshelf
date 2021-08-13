const Queue = require('bull');

const articlesQueue = new Queue('Articles Queue', process.env.REDIS_URL, {});

articlesQueue.process(__dirname + '/addArticleProcessor.js');

function saveUserArticleJob (url, userId, options = {}) {
  articlesQueue.add({ url, userId, options }, { removeOnComplete: true, removeOnFail: true });
}

function saveTopicArticleJob (url, userId, topicId, options = {}) {
  articlesQueue.add({ url, userId, topicId, options });
}

module.exports = {
  saveUserArticleJob,
  saveTopicArticleJob,
};
