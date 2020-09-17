const fs = require('fs');

module.exports = (modules) => {
  const controllers = {};

  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js') return;

    const name = file.split('.')[0];
    // eslint-disable-next-line global-require, import/no-dynamic-require
    controllers[name] = require(`./${name}`)(modules);
  });

  return controllers;
};
