'use strict'

const DiscountRepository = require('../models/repositories/discount.repo');
const {discount} = require('../models/discount.model');
const { convertToObjectId } = require('../utils');
const { BadRequestError } = require('../core/error.response');
const ProductRepository = require('../models/repositories/product.repo');

/**
 * Discount service
 * 1 - Generate discount code [Shop, Admin]
 * 2 - Get discount amount [User]
 * 3 - Get all discount codes [Admin]
 * 4 - Verify discount code [User]
 * 5 - Delete discount code [Admin]
 * 6 -Cancel discount code [Admin]
 */

class DiscountService {

    // Generate discount code
    static async generateDiscountCode(data) {
        const {
            code, start_date, end_date, discount_type, discount_value, discount_min_order_value,
            discount_limit, discount_used_count, discount_description, discount_name, discount_shop_id
        } = data;

        if(new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount not within valid date range');
        }

        const foundDiscount = await DiscountRepository.findDiscountByCodeAndShopId({
            code, shop_id: discount_shop_id
        });

        if(foundDiscount) {
            throw new BadRequestError('Discount code already exists');
        }

        return await DiscountRepository.generateDiscountCode({
            discount_name: discount_name,
            discount_description: discount_description,
            discount_code: code,
            discount_type: discount_type,
            discount_value: discount_value,
            discount_min_order_value: discount_min_order_value,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_limit: discount_limit,
            discount_used_count: discount_used_count,
            discount_shop_id: convertToObjectId(discount_shop_id)
        });

    }

    // Update discount code
    static async updateDiscountCode(data) {
        const discount = await DiscountRepository.findDiscountByCodeAndShopId({
            code: data.code,
            discount_shop_id: convertToObjectId(data.shop_id)
        });

        if(!discount) {
            throw new BadRequestError('Discount code does not exist');
        }

        return await DiscountRepository.updateDiscountCode(data);
    }

    static async getAllDiscountCodesWithProduct({
        code, shop_id
    }) {

        const discount = await DiscountRepository.findDiscountByCodeAndShopId({
            code, shop_id
        });

        if(!discount) {
            throw new BadRequestError('Discount code does not exist');
        }

        const { discount_applies_to, discount_products } = discount;
        let products;
        if(discount_applies_to === 'all_products') {
            products = await ProductRepository.findAllProducts({
                filter: {
                    shop_id: convertToObjectId(shop_id),
                    isPublished: true 
                },
                select: 'product_id, product_name'
            })
        }
        if(discount_applies_to === 'specific_products') {
            products = await ProductRepository.findAllProducts({
                filter: {
                    _id: { $in: discount_products },
                    isPublished: true 
                },
                select: 'product_id, product_name'
            })
        }
        return { discount, products };
    }

    // Get all discount codes
    static async getAllDiscountByShop(shop_id) {
        return await DiscountRepository.findAllDiscountByShop({
            discount_shop_id: convertToObjectId(shop_id)
        });
    }

    // Calculate discount amount
    static async getDiscountAmount({
        _id, shop_id, products
    }) {

        console.log('list products: ', products);
        const discount = await DiscountRepository.findDiscountByIdAndShopId({
            _id, shop_id
        });
        if(!discount) throw new BadRequestError('Discount code does not exist');

        const { 
            discount_status, 
            discount_limit, 
            discount_min_order_value, 
            discount_type, 
            discount_value, 
            discount_end_date,
            discount_start_date
        } = discount;

        if(discount_status === 'inactive') throw new BadRequestError('Discount code is inactive');
        if(discount_limit === 0) throw new BadRequestError('Discount code has been exhausted');
        if(new Date() < discount_start_date || new Date() > discount_end_date) throw new BadRequestError('Discount code is not within valid date range');

        let totalOrder = 0;
        totalOrder = products.reduce((acc, curr) => acc + curr.product_price, 0);
        if(discount_min_order_value > totalOrder) {
            throw new BadRequestError('Order value is less than minimum order value');
        }
        let amount = totalOrder;
        if(discount_type === 'fixed_amount') {
            amount -= discount_value;
        }
        if(discount_type === 'percentage') {
            amount -= (discount_value / 100) * totalOrder;
        }
        return {
            totalOrder,
            priceAfterDiscount: amount,
            discount
        }
    }

    // Delete discount code
    static async deleteDiscountCode({ code, shop_id }) {
        const discount = await discount.findOneAndDelete({
            discount_code: code,
            discount_shop_id: convertToObjectId(shop_id)
        });
        if(!discount) throw new BadRequestError('Discount code does not exist');
        return discount;
    }

    // Cancel discount code
    static async cancelDiscountCode({ code, shop_id }) {
        const discount = await discount.findOneAndUpdate({
            discount_code: code,
            discount_shop_id: convertToObjectId(shop_id)
        }, {
            discount_status: 'inactive'
        }, { new: true });
        if(!discount) throw new BadRequestError('Discount code does not exist');
        return discount;
    }   
}

module.exports = DiscountService;
