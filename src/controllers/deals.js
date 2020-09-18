// eslint-disable-next-line no-unused-vars
const csv = require('csv-parser');
const { Readable } = require('stream');

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
      const csvFile = '1,username1,gem1,100,10,2020-09-17 12:50\nusername2,gem2,150,5,2020-09-16 10:04\nusername3,gem3,100,100,2020-09-15 11:12\nusername4,gem4,200,2,2020-09-20 09:29\nusername5,gem5,220,11,2020-09-19 08:45\nusername6,gem6,13,1,2020-09-18 10:49\n';
      const rows = [];
      Readable.from([csvFile])
        .pipe(csv({ headers: ['customer', 'item', 'total', 'quantity', 'date'], strict: true }))
        .on('error', (error) => res.json({ status: 'Error', Desc: error.message }))
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', () => {
          console.log(rows);
          res.json({ status: 'OK' });
        });
    } catch (err) {
      next(err);
    }
  },
});
