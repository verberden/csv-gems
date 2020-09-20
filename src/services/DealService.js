const fs = require('fs');
const csv = require('csv-parser');
const array = require('lodash/array');
const signale = require('signale');
const { unlinkFiles, unlinkFile } = require('../../helpers');

module.exports = ({ models, redis }) => {
  class DealService {
    constructor() {
      this.models = models;
      this.redis = redis;
    }

    async processFile(files) {
      const fileObject = files.deal;
      if (!fileObject) {
        unlinkFiles(files);
        throw new Error('No deal file');
      }

      if (Array.isArray(files.deal)) {
        unlinkFiles(files);
        throw new Error('Should be one file');
      }

      if (fileObject.mimetype === 'text/csv') {
        const rows = await this.prepareDataFormFile(fileObject.tempFilePath);
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

        // clear cash
        await this.redis.del('top5Users');
      } catch (error) {
        await t.rollback();
        throw error;
      }
    }

    async getTop5Users() {
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

        const users = [];
        const allGems = [];
        // transform gems string into array and get all gems
        rawDeals.forEach((rawDeal) => {
          const deal = rawDeal.dataValues;
          const dealGems = deal.gems.split(',');
          deal.gems = dealGems;
          allGems.push(dealGems);
          users.push(deal);
        });

        // remove duplicates form all gems
        const gems = new Set(...allGems);

        const gemsObj = {};
        // get all gems wich which have 2 overlaps
        gems.forEach((gem) => {
          gemsObj[gem] = 0;
          users.forEach((user) => {
            if (user.gems.includes(gem)) {
              gemsObj[gem] += 1;
            }
          });

          if (gemsObj[gem] < 2) {
            delete gemsObj[gem];
          }
        });

        const soughtForGems = Object.keys(gemsObj);
        // keep matched gems
        users.forEach((user) => {
          // eslint-disable-next-line no-param-reassign
          user.gems = array.intersection(user.gems, soughtForGems);
        });

        await this.redis.set('top5Users', JSON.stringify(users));

        return users;
      } catch (error) {
        signale.error(error);
        throw error;
      }
    }

    async getCachedTop5Users() {
      const usersString = await this.redis.get('top5Users');
      if (usersString) {
        return JSON.parse(usersString);
      }
      return null;
    }
  }

  return new DealService();
};
