require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const Controllers = require('./src/controllers');

const Router = require('./config/router');

const app = express();
// const env = process.env.NODE_ENV === undefined ? 'development' : process.env.NODE_ENV;
app.set('views', path.join(__dirname, 'web', 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './tmp/',
}));

const controllers = Controllers();
const routes = Router({ controllers });
app.use('/', routes);

app.use((err, req, res, next) => {
  console.log(`Unhandled error detected: ${err.message}`);
  res.status(500).json({ error: '500 - server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: '404 - route not found' });
});

module.exports = app;
