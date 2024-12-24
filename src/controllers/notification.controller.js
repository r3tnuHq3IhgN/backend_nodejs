'use strict'

const { pushNotiToSystem, listenNotiByUserId } = require('../services/notification.service');

class NotificationController {
    pushNotiToSystem = async (req, res, next) => {
        new SuccessResponse({
            'message': 'Push notification to system successfully',
            'metadata': await pushNotiToSystem(req.body)
        }).send(res);
    }

    listenNotiByUserId = async (req, res, next) => {
        new SuccessResponse({
            'message': 'Listen notification by user id successfully',
            'metadata': await listenNotiByUserId(req.user.userId)
        }).send(res);
    }
}

module.exports = new NotificationController();