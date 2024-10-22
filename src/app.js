require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./databases/init.mongodb')._connect();
// const { checkOverload } = require('./helpers/check.connect');
// setInterval(checkOverload, 5000);


// init routes
app.use('/', require('./routes'));



module.exports = app;