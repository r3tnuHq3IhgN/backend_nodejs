'use strict'

const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notification.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUltils.js');

// Here not login

//authentication
router.use(authentication);
// push notification to system
router.post('/push', asyncHandler(notificationController.pushNotiToSystem));
// listen notification by user id
router.get('/listen', asyncHandler(notificationController.listenNotiByUserId));
module.exports = router;
