'use strict'

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

//check api
router.use(apiKey);
router.use(permission('READ'));

router.use('/v1/api', require('./access'));

router.use('/v1/api/product', require('./product'));

module.exports = router;