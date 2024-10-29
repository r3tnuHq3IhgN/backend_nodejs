'use strict'

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUltils.js');

//authentication
router.use(authentication);

// create product
router.post('/create', asyncHandler(productController.createProduct));  

module.exports = router;
