const fs = require('fs');

module.exports = (modules) => {
  const services = {};

  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js') return;

    const name = file.split('.')[0];
    // eslint-disable-next-line global-require, import/no-dynamic-require
    services[name] = require(`./${name}`)(modules);
  });

  return services;
};
