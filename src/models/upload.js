module.exports = ({ dbs: { csvDb, Sequelize } }) => {
  const Upload = csvDb.define(
    'Upload',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    {
      tableName: 'uploads',
      createdAt: 'created_at',
      updatedAt: false,
    },
  );

  Upload.associate = (models) => {
    Upload.hasMany(models.deal, {
      foreignKey: 'upload_id',
      as: 'deals',
    });
  };

  return Upload;
};
