'use strict'

const express = require('express');
const router = express.Router();
const DiscountController = require('../../controllers/discount.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUltils.js');


//authentication
router.use(authentication);

// generate discount code
router.post('/generate', asyncHandler(DiscountController.generateDiscountCode));

// update discount code
router.patch('/update', asyncHandler(DiscountController.updateDiscountCode));

// get all discount with product
router.get('/all', asyncHandler(DiscountController.getAllDiscountWithProduct));

module.exports = router;


