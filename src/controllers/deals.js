module.exports = ({ services }) => ({
  index: async (req, res, next) => {
    const { DealService } = services;
    try {
      const result = await DealService.show();
      res.json({ response: result });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      // console.log(req.files);
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
