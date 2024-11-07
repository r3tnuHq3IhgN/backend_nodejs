'use strict'

const CartService = require('../services/cart.service');
const { SuccessResponse } = require('../core/success.response');

class CartController {
    async addProductToCart(req, res, next) {
        new SuccessResponse({
            message: 'Get user cart successfully',
            metadata: await CartService.addProductToCart({
                userId: req.user.userId,
                productId: req.body.product_id,
                quantity: req.body.quantity
            })
        }).send(res);
    }
}

module.exports = new CartController();