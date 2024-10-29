'use strict'

const { CreatedResponse, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');
class AccessController {

    async handleRefreshToken(req, res, next) {
        new SuccessResponse({
            message: 'Refresh token successfully',
            metadata: await AccessService.handleRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore

            })
        }).send(res); 
    }
    async logOut(req, res, next) {
        new SuccessResponse({
            message: 'Logout successfully',
            metadata: await AccessService.logOut(req.keyStore)
        }).send(res); 
    }

    async signIn(req, res, next) {
        new SuccessResponse({
            message: 'Login successfully',
            metadata: await AccessService.signIn(req.body)
        }).send(res); 
    }
    
    async signUp(req, res, next) {
        new CreatedResponse({
            message: 'Register successfully',
            metadata: await AccessService.signUp(req.body)
        }).send(res); 
    }
}

module.exports = new AccessController();
