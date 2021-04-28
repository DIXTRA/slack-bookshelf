'use strict';
const { User, Article } = require('../../src/models');


module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await User.findOne();
    const article = await Article.findOne();

    return queryInterface.bulkInsert('UserArticles', [{
      ArticleId: article.id,
      UserId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
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
