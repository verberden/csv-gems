const fs = require('fs');

module.exports = (modules) => {
  const models = {};

  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js') return;

    const modelName = file.split('.')[0];
    models[modelName] = require(`./${modelName}`)(modules);
  });

  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  return models;
};
