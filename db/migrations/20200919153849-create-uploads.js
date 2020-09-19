module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('uploads', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }),

  down: async (queryInterface, Sequelize) => queryInterface.dropTable('uploads'),
};
