'use strict'

const CardRepository = require('../models/repositories/cart.repo');
const DiscountRepository = require('../models/repositories/discount.repo');
class CheckoutService {

    /*
    {
        cardId: String,
        userId: String,
        shop_order_ids: {
            shopId: String,
            shop_discount: [
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
        cardId, userId
    }) {
        const userCart = await CardRepository.getCardById(cardId, userId);

        if (!userCart) throw new Error('Card not found');
        const listShops = await userCart.cart_products.map(cart => cart.shop_id);
        const totalPrice = userCart.cart_total_price;

        const listDiscountActive = await DiscountRepository.getListDiscountWithCard({
            listShops,
            options: {
                discount_status: 'active',
                discount_min_order_value: { $lte: totalPrice },
            },
            select: ['discount_code', 'discount_type', 'discount_value', 'discount_min_order_value', 'discount_start_date', 'discount_end_date', 'discount_limit', 'discount_used_count', 'discount_shop_id', 'discount_applies_to', 'discount_products', 'discount_collections']
        });

       return { userCart, listDiscountActive };
    }
}

module.exports = CheckoutService;