'use strict'

const { Types } = require('mongoose');
const CardRepository = require('../models/repositories/cart.repo');
const DiscountService = require('./discount.service');
const ProductRepository = require('../models/repositories/product.repo');
const { BadRequestError } = require('../core/error.response');
class CheckoutService {

    /*
    {
        cardId: String,
        userId: String,
        shop_order_ids: {
            shopId: String,
            shop_discounts: [
                {
                    discountId: String,
                    discountValue: Number
                }
            ],
            item.product: [
                {
                    productId: String,
                    quantity: Number,
                    price: Number
                }
            ],

            orderIds: [String]
        }
    }
    */
    static async checkoutReview({
        cardId, userId, shop_order_ids
    }) {
        const userCart = await CardRepository.getCardById(cardId, userId);
        if (!userCart) throw new Error('Card not found');

        const checkout_order = {
            total_price: 0,
            fee_shipping: 0,
            total_discount: 0,
            total_checkout: 0
        }, shop_order_ids_new = [];

        // Check product by server
        for (let shop_order of shop_order_ids) {
            const  { shop_id, shop_discounts, item_products } = shop_order;
            const checkProductByServer = await ProductRepository.checkProductByServer({ item_products });

            if(!checkProductByServer[0]) throw new BadRequestError('Order has invalid product');

            const checkoutPrice = checkProductByServer.reduce((acc, product) => {
                return acc + product.price * product.quantity;
            }, 0);

            checkout_order.total_price += checkoutPrice;


            const item_checkout = {
                shop_id,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceAfterDiscount: checkoutPrice,
                item_products: checkProductByServer
            };
            // check valid discount
            if(shop_discounts.length > 0) {
                const { total_price, discount} = await DiscountService.getDiscountAmount({
                    _id : shop_discounts[0]._id,
                    shop_id: item_checkout.shop_id,
                    products: checkProductByServer
                });
                checkout_order.total_discount += discount.discount_value;
                if(discount.discount_value > 0) {
                    item_checkout.priceAfterDiscount = checkoutPrice - discount.discount_value;
                }
            }

            checkout_order.total_checkout += item_checkout.priceAfterDiscount;
            shop_order_ids_new.push(item_checkout);
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
}

module.exports = CheckoutService;