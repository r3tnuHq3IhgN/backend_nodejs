'use strict'

const { cart } = require('../cart.model');

class CartRepository {

    static async getCardById(cartId, userId) {
        return await cart.findOne({ _id: cartId, cart_state: 'active', cart_user_id: userId}).lean();
    }

    static async getUserCart(userId) {
        return await cart.findOne({ cart_user_id: userId }).lean();
    }

    static async createCart(data) {
        return await cart.create({
            ...data, 
            cart_count_products: data.cart_products.quantity, 
            cart_total_price: data.cart_products.quantity * data.cart_products.price 
            });
    }

    static async updateCart(userCart) {
        return await cart.findOneAndUpdate({
            cart_user_id: userCart.cart_user_id,
            cart_state: 'active'
        }, {
            cart_user_id: userCart.cart_user_id,
            cart_products: userCart.cart_products,
            cart_count_products: userCart.cart_count_products,
            cart_total_price: userCart.cart_total_price
        }, { 
            upsert: true, 
            new: true
        });
    }

    static async deleteCart(userId) {
        return await cart.findOneAndDelete({ cart_user_id: userId });
    }
}

module.exports = CartRepository;
