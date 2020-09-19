// eslint-disable-next-line no-unused-vars
module.exports = ({ services }) => ({
  index: async (req, res, next) => {
    try {
      res.json({ action: 'index' });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      // console.log(req.files);
      const { DealService } = services;
      if (req.files) {
        await DealService.processFile(req.files);
        return res.json({ status: 'OK' });
      }
      return res.json({ status: 'Error', Desc: 'No file' });
    } catch (err) {
      return res.json({ status: 'Error', Desc: err.message });
    }
  },
});
