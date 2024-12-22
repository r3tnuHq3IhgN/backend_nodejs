'use strict'

const Comment = require('../models/comment.model');
const { convertToObjectId } = require('../utils');
const ProductRepository = require('../models/repositories/product.repo');

class CommentService {
    static async createComment({
        productId, userId, content, parentId = null
    }) {
        const comment = new Comment({
            comment_product_id: productId,
            comment_user_id: userId,
            comment_content: content,
            comment_parent_id: parentId
        });
        let rightValue;
        if(parentId) {
            // reply comment
            const parentComment = await Comment.findOne({
                _id: convertToObjectId(parentId)
            });
            if(!parentComment) throw new Error('Parent comment not found');

            rightValue = parentComment.comment_right;
            await Comment.updateMany({
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            });

            await Comment.updateMany({
                comment_left: { $gte: rightValue }
            }, {
                $inc: { comment_left: 2 }
            });
        } else {
            // root comment
            const maxRightValue = await Comment.findOne({
                comment_product_id: convertToObjectId(productId),
            }).sort({ comment_right: -1 }).get('comment_right');
            console.log(maxRightValue);
            if (maxRightValue) {
                rightValue = maxRightValue + 1;
            } else {
                rightValue = 1;
            }
        }

         // insert comment
         comment.comment_left = rightValue
         comment.comment_right = rightValue + 1;
         await comment.save();
         return comment;

    }

    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0
    }) {
        if(parentCommentId) {
           const parent = await Comment.findById(convertToObjectId(parentCommentId));
           if(!parent) throw new Error('Parent comment not found');

           const comments = await Comment.find({
               comment_product_id: convertToObjectId(productId),
               comment_left: { $gt: parent.comment_left },
               comment_right: { $lt: parent.comment_right }
           }).sort({ comment_left: 1 }).limit(limit).skip(offset);
            return comments;
        }

        const comments = await Comment.find({
            comment_product_id: convertToObjectId(productId),
            comment_parent_id: parentCommentId
        }).sort({ comment_left: 1 }).limit(limit).skip(offset);
        return comments;

    }

    static async deleteComments({ commentId, productId }) {
        const foundProduct = await ProductRepository.getProductById(productId);
        if(!foundProduct) throw new Error('Product not found');
        const comment = await Comment.findById(convertToObjectId(commentId));
        if(!comment) throw new Error('Comment not found');

        const leftValue = comment.comment_left;
        const rightValue = comment.comment_right;
        const width = rightValue - leftValue + 1;

        await Comment.deleteMany({
            comment_product_id: convertToObjectId(productId),
            comment_left: { $gte: leftValue, $lte: rightValue }
        });

        await Comment.updateMany({
            comment_product_id: convertToObjectId(productId),
            comment_left: { $gt: rightValue }
        }, {
            $inc: { comment_left: -width }
        });

        await Comment.updateMany({
            comment_product_id: convertToObjectId(productId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: { comment_right: -width }
        });

        return true;
    }

}

module.exports = CommentService;