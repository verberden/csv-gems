const Redis = require('ioredis');

module.exports = ({ config }) => {
  let redis;

  Object.keys(config).forEach((name) => {
    if (config[name].adapter === 'redis') {
      const db = config[name];

      const options = {
        host: db.host,
        port: db.port,
      };

      redis = new Redis(options);
    }
  });

  return redis;
};
