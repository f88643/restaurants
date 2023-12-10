'use strict';
const bcrypt = require('bcryptjs')

const initialData = require('../public/jsons/restaurant.json').results;
initialData.forEach((data) => {
  data.createdAt = new Date();
  data.updatedAt = new Date();
  if (data.id <= 3) {
    data.userID = 1
  }
  if (data.id > 3 && data.id <= 6) {
    data.userID = 2
  }
  delete data.id
});



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hash = await bcrypt.hash('12345678', 10)
    await queryInterface.bulkInsert('restaurants', initialData);
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'root',
        email: 'user1@example.com',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'root',
        email: 'user2@example.com',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurants', null);
    await queryInterface.bulkDelete('users', null);
  }
};
