'use strict'

const { discount } = require('../discount.model');
const { convertToObjectId } = require('../../utils');

class DiscountRepository {

        static async generateDiscountCode(data) {
            return await discount.create(data);
        }

        static async updateDiscountCode(data) {
            return await discount.findByIdAndUpdate({
                discount_code: data.code,
                discount_shop_id: convertToObjectId(data.shop_id)
            }, data, { new: true });
        }

        static async findAllDiscountByShop(shop_id) {
            return await discount.find({ discount_shop_id: convertToObjectId(shop_id) }).lean();
        }

        static async checkDiscountExistence({ code, shop_id }) {
            return await discount.findOne({
                discount_code: code,
                discount_shop_id: convertToObjectId(shop_id)
            }).lean();
        }
        static async findDiscountByCodeAndShopId({ code, shop_id }) {
            return await discount.findOne({
                discount_code: code,
                discount_shop_id: convertToObjectId(shop_id)
            }).lean();
        }

        static async getListDiscountWithCard({ listShops, options, select }) {
            return await discount.find({
                ...options,
                discount_shop_id: { $in: listShops },
            }).select(select).lean();
        }
}

module.exports = DiscountRepository;