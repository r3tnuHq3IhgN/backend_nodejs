'use strict'

const { inventory } = require('../inventory.model');

class InventoryRepository {

    async createInventory(data) {
        return await inventory.create(data);
    }

    async updateInventoryById({ inventoryId, data, model, isNew = true }) {
        return  await model.findByIdAndUpdate(inventoryId, data, { new: isNew });
    }
}

module.exports = new InventoryRepository;