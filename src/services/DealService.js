const fs = require('fs');
const csv = require('csv-parser');

// TODO: helper?
function unlinkFile(path) {
  fs.unlink(path, (err) => {
    if (err) console.log(err.message);
  });
}

module.exports = ({ models }) => {
  class DealService {
    constructor() {
      this.models = models;
    }

    async processFile(files) {
      const fileObject = files.deal;
      if (!fileObject) {
        // TODO: helper?
        const tmpFilesPath = [];
        const keys = Object.keys(files);
        keys.forEach((key) => {
          const value = files[key];
          if (Array.isArray(value)) {
            value.forEach((el) => {
              tmpFilesPath.push(el.tempFilePath);
            });
          } else {
            tmpFilesPath.push(value.tempFilePath);
          }
        });
        tmpFilesPath.forEach((tmpPath) => {
          unlinkFile(tmpPath);
        });

        throw new Error('No deal file');
      }
      if (fileObject.mimetype === 'text/csv') {
        const rows = await this.prepareDataFormFile(fileObject.tempFilePath);
        console.log(rows);
        unlinkFile(fileObject.tempFilePath);
        return rows;
      }

      unlinkFile(fileObject.tempFilePath);
      throw new Error('Not a csv file');
    }

    // eslint-disable-next-line class-methods-use-this
    async prepareDataFormFile(tempFilePath) {
      // const rows = [];
      const dataRows = await new Promise((resolve, reject) => {
        const rows = [];
        return fs.createReadStream(tempFilePath)
          .on('error', (err) => {
            reject(err);
          })
          .pipe(csv({ headers: ['customer', 'item', 'total', 'quantity', 'date'], strict: true }))
          .on('error', (error) => reject(error))
          .on('data', (row) => {
            rows.push(row);
          })
          .on('end', () => {
            resolve(rows);
          });
      });

      return dataRows;
    }

    async saveToDb(dataRows) {
      const { upload: Upload, deal: Deal } = this.models;
      const t = await Upload.sequelize.transaction();

      try {
        const upload = await Upload.create({}, { transaction: t });
        const rows = [];
        dataRows.forEach((dataRow) => {
          const tmpRow = dataRow;
          tmpRow.upload_id = upload.id;
          rows.push(tmpRow);
        });

        await Deal.bulkCreate([...rows], { transaction: t });
        await t.commit();
      } catch (error) {
        await t.rollback();
        throw error;
      }
    }

    async show() {
      const { deal: Deal } = this.models;

      try {
        const deals = await Deal.findAll({
          attributes: [['customer', 'username'], [Deal.sequelize.literal('SUM(Deal.total)'), 'spent_money']],
          group: ['customer'],
          limit: 5,
          order: Deal.sequelize.literal('spent_money DESC'),
        });

        return deals;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }

  return new DealService();
};
