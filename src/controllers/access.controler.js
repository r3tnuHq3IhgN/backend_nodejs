'use strict'

const { CreatedResponse, OKResponse, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');
class AccessController {

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