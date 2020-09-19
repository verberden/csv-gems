module.exports = ({ dbs: { csvDb, Sequelize } }) => {
  const Deal = csvDb.define(
    'Deal',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      customer: Sequelize.STRING,
      item: Sequelize.STRING,
      total: Sequelize.DECIMAL(10, 2),
      quantity: Sequelize.INTEGER,
      date: Sequelize.DATE,
      upload_id: Sequelize.INTEGER,
    },
    {
      tableName: 'deals',
      createdAt: 'created_at',
      updatedAt: false,
    },
  );

  return Deal;
};
