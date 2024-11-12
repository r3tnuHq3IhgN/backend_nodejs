'use strict'

const { inventory } = require('../inventory.model');

class InventoryRepository {

    static async createInventory(data) {
        return await inventory.create(data);
    }

    static async updateInventoryById({ inventoryId, data, model, isNew = true }) {
        return  await model.findByIdAndUpdate(inventoryId, data, { new: isNew });
    }

    // Find inventory and update
    static async findInventoryAndUpdate({ query, updateSet, options }) {
        return await inventory.findOne(query).updateOne(updateSet, options);
    }
}

module.exports = InventoryRepository;