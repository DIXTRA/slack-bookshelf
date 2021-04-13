const { Topic } = require('../models');

async function topicExists(name, TeamId) {
  const count = await Topic.count({ where: { name, TeamId } });
  return count != 0;
}

module.exports = { topicExists };
