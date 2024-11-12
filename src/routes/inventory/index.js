'use strict'

const express = require('express');
const router = express.Router();
const InventoryController = require('../../controllers/inventory.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUltils.js');


//authentication
router.use(authentication);

// add stock to inventory
router.post('/add-stock', asyncHandler(InventoryController.addStockToInventory));

module.exports = router;