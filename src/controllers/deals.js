module.exports = ({ services }) => ({
  index: async (req, res, next) => {
    const { DealService } = services;
    try {
      let result = await DealService.getCachedTop5Users();
      if (!result) {
        result = await DealService.getTop5Users();
      }
      res.json({ response: result });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const { DealService } = services;
      if (req.files) {
        const rows = await DealService.processFile(req.files);
        await DealService.saveToDb(rows);
        return res.json({ status: 'OK' });
      }
      return res.json({ status: 'Error', Desc: 'No file' });
    } catch (err) {
      return res.json({ status: 'Error', Desc: err.message });
    }
  },
});
