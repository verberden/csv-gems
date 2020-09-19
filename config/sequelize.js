require('dotenv').config();
const databases = require('./databases');

const config = databases.csvDb;
const env = process.env.NODE_ENV || 'development';

module.exports = {
  [env]: config,
};
