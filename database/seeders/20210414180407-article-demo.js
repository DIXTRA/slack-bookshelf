'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Articles', [{
      id: '0395e549-8258-425c-99e8-bd20a1d8abdd',
      url: 'https://betterprogramming.pub/multithreaded-ruby-synchronization-race-conditions-and-deadlocks-f1f1a7cddcea',
      title: "Multithreaded Ruby — Synchronization, Race Conditions and Deadlocks | by Gernot Gradwohl | Better Programming",
      description: "Threads even on MRI Ruby can lead to race conditions and deadlocks, which can crash your service and can be very hard to identify because of the non deterministic nature.",
      author: 'Gernot Gradwohl',
      keywords: 'Ruby Concurrency Deadlocks',
      image: 'https://miro.medium.com/max/1200/1*t8o69aldwX8d9b1Mf_lErQ.jpeg',
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
