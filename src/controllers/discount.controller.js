'use strict'

const discountService = require('../services/discount.sevice');
const { SuccessResponse, CreatedResponse } = require('../core/success.response');

class DiscountController {
    async generateDiscountCode(req, res, next) {
        new CreatedResponse({
            message: 'Discount code generated successfully',
            metadata: await discountService.generateDiscountCode(req.body)
        }).send(res);
    }

    async updateDiscountCode(req, res, next) {
        new SuccessResponse({
            message: 'Discount code updated successfully',
            metadata: await discountService.updateDiscountCode(req.body)
        }).send(res);
    }

    async getAllDiscountWithProduct(req, res, next) {
        new SuccessResponse({
            message: 'Get all discount with product successfully',
            metadata: await discountService.getAllDiscountCodesWithProduct(req.query)
        }).send(res);
    }
}

module.exports = new DiscountController();