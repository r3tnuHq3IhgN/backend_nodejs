const express = require('express');
const router = express.Router();

const cartController = require('../../controllers/cart.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUltils.js');

router.use(authentication);

router.post('/create', asyncHandler(cartController.addProductToCart));

module.exports = router;