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

// test pubsub redis
// const productTest = require('./tests/product.test');
// require('./tests/inventory.test');
// productTest.purchaseProduct('product:002', 10);



//init database
require('./databases/init.mongodb')._connect();
// const { checkOverload } = require('./helpers/check.connect');
// setInterval(checkOverload, 5000);

// init routes
app.use('/', require('./routes'));

// init error handler
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
        error: {
            code: statusCode,
            status: 'error',
            stack: error.stack,
            message: error.message || 'Internal Server Error'
        }
    });
});



module.exports = app;