'use strict'

const {Schema, model, Types} = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

// Declare the Schema of the Mongo model

var orderSchema = new Schema({
    order_user: {
        type: Types.ObjectId,
        required: true,
        default: '1234567890',
    },
    order_checkout: {
        type: Object,
        required: true,
        default: {}
    },
    order_shipping: {
        type: Object,
        required: true,
        default: {}
    },
    order_payment: {
        type: Object,
        required: true,
        default: {}
    },
    order_products: {
        type: Array,
        required: true,
        default: []
    },
    order_tracking_number: {
        type: String,
        required: true,
        default: ''
    },
    order_status: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending'
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

//Export the model
module.exports = {
    order: model(DOCUMENT_NAME, orderSchema)
}
