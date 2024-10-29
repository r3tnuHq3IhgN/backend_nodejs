'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

var productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_description: {
        type: String
    },
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothings', 'Furnitures']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    product_atrributes: {
        type: Schema.Types.Mixed,
        required: true
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    }
},{
    collection: 'Clothings',
    timestamps: true
});

const electronicSchema = new Schema({
    manufacturer: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    }
},{
    collection: 'Electronics',
    timestamps: true
});


module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronic', electronicSchema)
};
