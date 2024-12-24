'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

// Order-001: Order created
// Order-002: Order failed
// Promotion-001: Promotion created
// Shop-001: new Product by User
const notificationSchema = new Schema({
    noti_type: { type: String, enum: ['Order-001', 'Order-002', 'Promotion-001', 'Shop-001'] , required: true },
    noti_sender_id: { type: Schema.Types.ObjectId },
    noti_receiver_id: { type: Schema.Types.ObjectId },
    noti_content: { type: String, required: true },
    noti_options: { type: Object }
}, { 
    timestamps: true,
    collection: COLLECTION_NAME
 });

module.exports = {
    NOTI: model(DOCUMENT_NAME, notificationSchema)
}
