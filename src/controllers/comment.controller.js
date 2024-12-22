'use strict'

const CommentService = require('../services/comment.service');
const { SuccessResponse } = require('../core/success.response');

class CommentController {

    async createComment(req, res, next) {
        new SuccessResponse({
            message: 'Comment created successfully',
            metadata: await CommentService.createComment(req.body)
        }).send(res);
    }
    async getCommentsByParentId(req, res, next) {
        new SuccessResponse({
            message: 'Comments retrieved successfully',
            metadata: await CommentService.getCommentsByParentId(req.query)
        }).send(res);
    }

    async deleteComments(req, res, next) {
        new SuccessResponse({
            message: 'Comment deleted successfully',
            metadata: await CommentService.deleteComments(req.query)
        }).send(res);
    }

}

module.exports = new CommentController();
