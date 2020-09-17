// eslint-disable-next-line no-unused-vars
module.exports = () => ({
  index: async (req, res, next) => {
    try {
      res.json({ action: 'index' });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      res.json({ action: 'create' });
    } catch (err) {
      next(err);
    }
  },
});
