'use strict'

const { BadRequestError } = require('../core/error.response');
const InventoryRepository = require('../models/repositories/inventory.repo');
const ProductRepository = require('../models/repositories/product.repo');

class InventoryService {

    static async reservationInventory({productId, quantity, cardId }) {
        const query = {
            inventory_product: productId,
            inventory_quantity: { $gte: quantity }
        }, updateSet = {
            $inc: { inventory_quantity: -quantity },
            $push: { 
                inventory_reservations: {
                     cardId,
                     quantity,
                     createdAt: new Date()
                }
            }
        }, options = { new: true, upset: true };
        return await InventoryRepository.findInventoryAndUpdate({ query, updateSet, options });
    }

    static async addStockToInventory({
        productId, 
        quantity_stock,
        shopId,
        location
    }) {
        const product = await ProductRepository.getProductById(productId);
        if (!product) return BadRequestError('Product not found');

        const query = {
            inventory_product: productId,
            inventory_shop: shopId,
        }, updateSet = {
            $inc: { inventory_stock: quantity_stock },
            $set: { inventory_location: location }
        }, options = { new: true, upset: true };

        return await InventoryRepository.findInventoryAndUpdate({ query, updateSet, options });
    }
}

module.exports = InventoryService;