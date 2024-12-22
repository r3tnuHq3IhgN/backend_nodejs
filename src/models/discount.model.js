'use strict'

const { model, Schema, Types } = require('mongoose');
const moment = require('moment');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';



// Declare the Schema of the Mongo model
var discountSchema = new Schema({

    discount_name: {
        type: String,
        required: true,
        unique: true
    },
    discount_description: {
        type: String,
        required: true,
        default: 'No description'
    },
    discount_code: {
        type: String,
        required: true,
        unique: true
    },
    discount_type: {
        type: String,
        required: true,
        default: 'fixed_amount',
        enum: ['fixed_amount', 'percentage']
    },
    discount_value: {
        type: Number,
        required: true,
        default: 0
    },
    discount_min_order_value: {
        type: Number,
        required: true,
    },
    discount_start_date: {
        type: Date,
        required: true,
        default: moment().add().toDate()
    },
    discount_end_date: {
        type: Date,
        required: true, 
        default: moment().add(1, 'months').toDate()
    },
    discount_limit: {
        type: Number,
        required: true,
        default: 0
    },
    discount_used_count: {
        type: Number,
        required: true,
        default: 0
    },
    discount_users_used: {
        type: Array,
        default: []
    },
    discount_status: {
        type: String,
        required: true,
        default: 'active',
        enum: ['active', 'inactive']
    },
    discount_shop_id: {
        type: Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    discount_applies_to: {
        type: String,
        required: true,
        default: 'all',
        enum: ['all', 'specific_products', 'specific_collections']
    },
    discount_products: {
        type: Array,
        default: []
    },
    discount_collections: {
        type: Array,
        default: []
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

//Export the model
module.exports = {
    discount: model(DOCUMENT_NAME, discountSchema)
}