'use strict'

const { CreatedResponse, OKResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');
class AccessController {
    async signUp(req, res, next) {
        new CreatedResponse({
            message: 'Register successfully',
            metadata: await AccessService.signUp(req.body)
        }).send(res); 
    }
}

module.exports = new AccessController();