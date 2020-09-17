require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
// const env = process.env.NODE_ENV === undefined ? 'development' : process.env.NODE_ENV;
app.set('views', path.join(__dirname, 'web', 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next) => {
  res.send('It works');
});

module.exports = app;
