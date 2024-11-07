'use strict'

const CartRepository = require('../models/repositories/cart.repo');
const ProductRepository = require('../models/repositories/product.repo');
const { Types } = require('mongoose');

class CartService {
     // add product to cart
     static async addProductToCart({ userId, productId, quantity }) {
          // check if user or product id is valid
          if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) throw new Error('Invalid user or product id');

          // get shop id and price of product
          const shopId = await ProductRepository.getShopIdByProductId(productId);
          const priceProduct = await ProductRepository.getProductPriceById(productId);

          // check if shop id and price of product is valid
          if (!shopId) throw new Error('Product not found');
          if (!priceProduct) throw new Error('Product price not found');

          // check if user cart exists
          const userCart = await CartRepository.getUserCart(userId);

          if (!userCart) {
               if (quantity <= 0) throw new Error('Invalid quantity');
               return await CartRepository.createCart({ 
                    cart_user_id: userId, 
                    cart_products: 
                         { 
                              product_id: productId, 
                              shop_id: shopId, 
                              quantity, 
                              price: priceProduct 
                         }
               });
          } else {
               // check if product already exists in cart
               const productIndex = userCart.cart_products.findIndex(product => product.product_id.equals(productId));
               // if product not exists in cart
               if (productIndex === -1) {
                    if (quantity <= 0) throw new Error('Invalid quantity');
                    userCart.cart_products.push({ product_id: productId, shop_id: shopId, quantity });
                    userCart.cart_total_price = userCart.cart_total_price + (priceProduct * quantity);
               }
               // if sum of quantity and quantity in cart less than 0, delete product from cart and update total price 
               else {
                    const quantityProduct = userCart.cart_products[productIndex].quantity + quantity;
                    if(quantityProduct <= 0) {
                         userCart.cart_total_price = userCart.cart_total_price - (priceProduct * userCart.cart_products[productIndex].quantity);
                         userCart.cart_products.splice(productIndex, 1);
                    } else {
                         userCart.cart_products[productIndex].quantity = quantityProduct;
                         userCart.cart_total_price = userCart.cart_total_price + (priceProduct * quantity);
                    }
               }

               // if cart is empty, delete cart
               if(userCart.cart_products.length === 0) {
                    return await CartRepository.deleteCart(userCart.cart_user_id);
               }

               // calculate total products
               userCart.cart_count_products = userCart.cart_products.reduce((total, product) => total + product.quantity, 0);

               return await CartRepository.updateCart(userCart);
          }
    }

    //update product in cart
    
}

module.exports = CartService;