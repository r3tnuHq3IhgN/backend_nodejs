'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';

const commentSchema = new Schema({

    comment_product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
    comment_user_id: { type: Schema.Types.ObjectId, ref: 'Shop' },
    comment_content: { type: String, required: true },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parent_id: { type: Schema.Types.ObjectId, ref: 'Comment' },
    is_deleted: { type: Boolean, default: false },
}, { 
    timestamps: true,
    collection: COLLECTION_NAME
 });

module.exports = model(DOCUMENT_NAME, commentSchema);
