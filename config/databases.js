module.exports = {
  csvDb: {
    adapter: 'sequelize',
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    username: process.env.MYSQL_USER || 'user',
    password: process.env.MYSQL_PASSWORD || '1234',
    database: process.env.MYSQL_DATABASE || 'csvDb',
    dialect: 'mariadb',
  },
};
