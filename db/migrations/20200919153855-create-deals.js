module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('deals', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    customer: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    item: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    total: {
      allowNull: false,
      type: Sequelize.DECIMAL(10, 2),
    },
    quantity: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    date: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    upload_id: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }),

  down: async (queryInterface, Sequelize) => queryInterface.dropTable('deals'),
};
