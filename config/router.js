const express = require('express');

const router = express.Router();

module.exports = ({ controllers }) => {
  router.get('/deals', controllers.deals.index);
  router.post('/deals', controllers.deals.create);

  return router;
};
