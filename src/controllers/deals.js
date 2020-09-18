// eslint-disable-next-line no-unused-vars
const csv = require('csv-parser');
const fs = require('fs');

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
      // console.log(req.files);
      if (req.files) {
        const dealFileObj = req.files.deal;
        if (!dealFileObj) {
          return res.json({ status: 'Error', Desc: 'No deal file' });
        }

        if (dealFileObj.mimetype === 'text/csv') {
          const rows = [];
          return fs.createReadStream(dealFileObj.tempFilePath)
            .on('error', (err) => { next(err); })
            .pipe(csv({ headers: ['customer', 'item', 'total', 'quantity', 'date'], strict: true }))
            .on('error', (error) => res.json({ status: 'Error', Desc: error.message }))
            .on('data', (row) => {
              rows.push(row);
            })
            .on('end', () => {
              console.log(rows);
              res.json({ status: 'OK' });
            });
        }
        return res.json({ status: 'Error', Desc: 'Not a csv file' });
      }
      return res.json({ status: 'Error', Desc: 'No file' });
    } catch (err) {
      return next(err);
    }
  },
});
