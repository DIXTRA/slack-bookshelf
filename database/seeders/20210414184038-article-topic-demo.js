'use strict';
const { User, Article, Topic } = require('../../src/models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await User.findOne();
    const topic = await Topic.findOne();
    const article = await Article.findOne();

    return queryInterface.bulkInsert('ArticleTopics', [{
      id: "0395e549-8258-425c-99e8-bd20a1d8abe3",
      approved: true,
      CreatedById: user.id,
      ReviewedById: user.id,
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
