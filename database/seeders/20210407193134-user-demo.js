'use strict';
const { Team } = require('../../src/models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const team = await Team.findOne();

    return queryInterface.bulkInsert('Users', [{
      id: "0395e549-8258-425c-99e8-bd20a1d8abdc",
      slackId: "U01QWBBE4SZ",
      displayName: "Diego del Valle",
      username: "diego.valle",
      isAdmin: true,
      TeamId: team.id,
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
