'use strict';
const { Team, User } = require('../../src/models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const team = await Team.findOne();
    const user = await User.findOne();

    return queryInterface.bulkInsert('Topics', [{
      id: "0395e545-8258-425c-99e8-bd20a1d8abda",
      name: 'Test',
      description: 'this is a topic to test',
      enabled: true,
      createdBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      TeamId: team.id,
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
