'use strict'

const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/comment.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUltils.js');

//authentication
router.use(authentication);

router.post('/create', asyncHandler(commentController.createComment));
router.get('/', asyncHandler(commentController.getCommentsByParentId));
router.delete('/', asyncHandler(commentController.deleteComments));

module.exports = router;