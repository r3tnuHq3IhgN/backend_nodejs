'use strict'
const { product } = require('../product.model');
const { getSelectData } = require('../../utils/index');

class ProductRepository {

    async createProduct(data) {
        return await product.create(data);
    }
    
    async queryProduct({ query, limit, skip }) {
        return await product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
    }

    static async updateProductById({ productId, data, model, isNew = true }) {
        return await model.findByIdAndUpdate(productId, data, { new: isNew });
    }

    static async getAllDraftProductsOfShop({ query, limit, skip }) {
        return queryProduct();
    }

    static async getAllPublishedProductsOfShop({ query, limit, skip }) {
        return queryProduct();
    }

    static async publishedProductByShop(shopId, productId) {
        const foundProduct = await product.findOne({ _id: productId, product_shop: shopId, isDraft: true });
        if (!foundProduct) return null;
        foundProduct.isDraft = false;
        foundProduct.isPublished = true;
        return await foundProduct.save();
    }

    static async unpublishedProductByShop(shopId, productId) {
        const foundProduct = await product.findOne({ _id: productId, product_shop: shopId, isPublished: true });
        if (!foundProduct) return null;
        foundProduct.isPublished = false;
        foundProduct.isDraft = true;
        return await foundProduct.save();
    }

    static async searchProductsByUser(keyword) {
        const regexSearch = new RegExp(keyword, 'i');
        return await product.find({ 
            $text: { $search: regexSearch },
            isPublished: true
        }, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .lean()
    }

    static async findAllProducts(limit, sort, page, filter, select) {
        const skip = (page - 1) * limit;
        const sortBy = sort === 'ctime' ? { _id: -1} : { _id: 1};
        return await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
        .exec();
    }

    // get shop id by product id => CartService
    static async getShopIdByProductId(productId) {
        const foundProduct = await product.findById(productId).lean();
        return foundProduct ? foundProduct.product_shop : null;
    }

    //
    static async getProductPriceById(productId) {
        const foundProduct = await product.findById(productId).lean();
        return foundProduct ? foundProduct.product_price : null;
    }
}
module.exports = ProductRepository;