'use strict'

const express = require('express');
const router = express.Router();
const CheckoutController = require('../../controllers/checkout.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUltils.js');


//authentication
router.use(authentication);

// checkout review
router.post('/review', asyncHandler(CheckoutController.checkoutReview));

// checkout order
router.post('/order', asyncHandler(CheckoutController.checkoutOrder));

module.exports = router;


