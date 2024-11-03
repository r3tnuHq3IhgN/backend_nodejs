'use strict'

const { discount } = require('../discount.model');

class DiscountRepository {
    
        async generateDiscountCode(data) {
            return await discount.create(data);
        }

        async updateDiscountCode(data) {
            return await discount.findByIdAndUpdate({
                discount_code: data.code,
                discount_shop_id: convertToObjectId(data.shop_id)
            }, data, { new: true });
        }

        async findAllDiscountByShop(shop_id) {
            return await discount.find({ discount_shop_id: convertToObjectId(shop_id) }).lean();
        }

        async checkDiscountExistence({ code, shop_id }) {
            return await discount.findOne({
                discount_code: code,
                discount_shop_id: convertToObjectId(shop_id)
            }).lean();
        }
}

module.exports = new DiscountRepository;