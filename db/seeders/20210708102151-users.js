'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    //  return queryInterface.bulkInsert('Users', [
    //   {
    //     username: 'johndoe1',
    //     firstName: 'John',
    //     lastName: 'Doe 1',
    //     email: 'example1@example.com',
    //     password:
    //       '$2y$10$mj1OMFvVmGAR4gEEXZGtA.R5wYWBZTis72hSXzpxEs.QoXT3ifKSq', // password
    //     status: 1,
    //     gender: 'f',
    //     phoneNumber: '0239239249239',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return queryInterface.bulkDelete('Users', null, {});
  }
};
