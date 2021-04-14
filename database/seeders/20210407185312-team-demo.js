'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Teams', [{
      id: "0395e549-8258-425c-99e8-bd20a1d8abdc",
      slackId: "T01QSKEL1QW",
      name: "slack-bookshelf",
      token: "xoxb-1842660681846-1844217122567-Qq6SvfT1uD0SAfd0z2Ho3Non",
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Teams', null, {});
  }
};
