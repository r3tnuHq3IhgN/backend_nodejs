'use strict'

const {Schema, model, Types} = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

// Declare the Schema of the Mongo model
var inventorySchema = new Schema({
    inventory_product: {
        type: Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    inventory_location: {
        type: String,
        required: true,
        default: 'unknown'
    },
    inventory_stock: {
        type: Number,
        required: true,
        default: 0
    },
    inventory_shop: {
        type: Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    inventory_reservations: {
        type: Array,
        default: []
    },


}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

//Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}