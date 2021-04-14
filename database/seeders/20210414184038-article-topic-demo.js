'use strict';
const { User, Article, Topic } = require('../../src/models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await User.findOne();
    const topic = await Topic.findOne();
    const article = await Article.findOne();

    return queryInterface.bulkInsert('ArticleTopics', [{
      approved: true,
      createdBy: user.id,
      reviewedBy: user.id,
      reviewedAt: new Date(),
      comment: 'todo ok',
      createdAt: new Date(),
      updatedAt: new Date(),
      ArticleId: article.id,
      TopicId: topic.id,
    }]);
  },
  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
