const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

require('./databases/init.mongodb')._connect()
require('./databases/init.mongodb')._connect()
require('./databases/init.mongodb')._connect()
const { checkOverload } = require('./helpers/check.connect');
setInterval(checkOverload, 5000);
// init routes
app.get('/', (req, res) => {
    const strMess = 'Hello World';
    return res.status(200).json({ 
        message: 'Test',
        metadata: strMess.repeat(1000000)
    });
});
module.exports = app;