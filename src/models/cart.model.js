'use strict'

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const cartSchema = new Schema({
    cart_state: {
        type: String,
        required: true,
        default: 'active',
        enum: ['active', 'completed', 'cancelled', 'pending', 'failed']
    },
    cart_user_id: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cart_products: [{
        product_id: {
            type: Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        shop_id: {
            type: Types.ObjectId,
            required: true,
            ref: 'Shop'
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    cart_count_products: {
        type: Number,
        required: true,
        default: 0
    },
    cart_total_price: {
        type: Number,
        required: true,
        default: 0
    },
}, { 
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'modified_at'
    }
 });

module.exports = {
    cart: model(DOCUMENT_NAME, cartSchema)
}
