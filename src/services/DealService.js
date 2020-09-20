const fs = require('fs');
const csv = require('csv-parser');
const array = require('lodash/array');

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
        const rawDeals = await Deal.findAll({
          attributes: [
            ['customer', 'username'],
            [Deal.sequelize.literal('SUM(Deal.total)'), 'spent_money'],
            [Deal.sequelize.literal('GROUP_CONCAT(Deal.item)'), 'gems'],
          ],
          group: ['customer'],
          limit: 5,
          order: Deal.sequelize.literal('spent_money DESC'),
        });

        const deals = [];
        const allGems = [];
        // transform gems string into array and get all gems
        rawDeals.forEach((rawDeal) => {
          const deal = rawDeal.dataValues;
          const dealGems = deal.gems.split(',');
          deal.gems = dealGems;
          allGems.push(dealGems);
          deals.push(deal);
        });

        // remove duplicates form all gems
        const gems = new Set(...allGems);

        const gemsObj = {};
        // get all gems wich which have 2 overlaps
        gems.forEach((gem) => {
          gemsObj[gem] = 0;
          deals.forEach((deal) => {
            if (deal.gems.includes(gem)) {
              gemsObj[gem] += 1;
            }
          });

          if (gemsObj[gem] < 2) {
            delete gemsObj[gem];
          }
        });

        const soughtForGems = Object.keys(gemsObj);
        // keep matched gems
        deals.forEach((deal) => {
          // eslint-disable-next-line no-param-reassign
          deal.gems = array.intersection(deal.gems, soughtForGems);
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
