'use strict';

const initialData = require('../public/jsons/restaurant.json').results
initialData.forEach((data) => {
  delete data.id
  data.createdAt = new Date()
  data.updatedAt = new Date()
})

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('restaurants', initialData)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurants', null)
  }
};