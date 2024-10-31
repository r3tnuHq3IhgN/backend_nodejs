'use strict'
const { product } = require('../product.model');

class ProductRepository {

    async createProduct(data) {
        return await product.create(data);
    }

    static async getAllDraftProductsOfShop(shopId) {
        return await product.find({ product_shop: shopId, isDraft: true })
        .sort({ createdAt: -1 })
        .skip(0)
        .limit(10)
        .lean()
        .exec();
    }

    static async getAllPublishedProductsOfShop(shopId) {
        return await product.find({ product_shop: shopId, isPublished: true })
        .sort({ createdAt: -1 })
        .skip(0)
        .limit(10)
        .lean()
        .exec();
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
}

module.exports = ProductRepository;