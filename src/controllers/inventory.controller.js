'use strict'

const InventoryService = require('../services/inventory.service');
const { SuccessResponse } = require('../core/success.response');


class InventoryController {
    async addStockToInventory(req, res, next) {
        new SuccessResponse({
            message: 'Add stock to inventory successfully',
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res);
    }
}

module.exports = new InventoryController();