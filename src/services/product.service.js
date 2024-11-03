'use strict'

const { product, clothing, electronic } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const ProductRepository = require('../models/repositories/product.repo');
const InventoryRepository = require('../models/repositories/inventory.repo');
const { removeUndefinedValues, updateNestedObject } = require('../utils/index');
const mongoose = require('mongoose');

// Factory pattern
class ProductFactory {
   static productRegistry = {};

    static registerProductType(type, class_ref) {
        ProductFactory.productRegistry[type] = class_ref;
    }

    // Use strategy pattern with factory pattern to create product by mapping product type
    static async createProduct(type, data){
        const productClass = ProductFactory.productRegistry[type];
        console.log('productClass_create::', productClass);
        if(!productClass) return new BadRequestError('Error: Product type not found');
        return new productClass(data).createProduct();
    }

    //update product
    static async updateProduct(productId, data) {

        const foundProduct = await product.findById(productId);
        if(!foundProduct) return new BadRequestError('Error: Product not found');

        const productType = foundProduct.product_type;
        const productClass = ProductFactory.productRegistry[productType];

        if (!productClass || typeof productClass.prototype.updateProduct !== 'function') {
            throw new BadRequestError('Error: updateProduct method not found on product class');
        }

        return await new productClass(foundProduct).updateProduct(productId, removeUndefinedValues(data));
    }


    //put
    static async publishedProductByShop(shopId, productId) {
        return await ProductRepository.publishedProductByShop(shopId, productId);
    }
    
    static async unpublishedProductByShop(shopId, productId) {
        return await ProductRepository.unpublishedProductByShop(shopId, productId);
    }


    //query
    static async getAllDraftProductsOfShop({ shopId, limit = 50, skip = 0 }) {
        const query = { product_shop: shopId, isDraft: true };
        return await ProductRepository.getAllDraftProductsOfShop({ query, limit, skip });
    }
    static async getAllPublishedProductsOfShop(shopId, limit = 50, skip = 0) {
        const query = { product_shop: shopId, isPublished: true };
        return await ProductRepository.getAllPublishedProductsOfShop({ query, limit, skip });
    }

    //search
    static async searchProductsByUser(keyword) {
        return await ProductRepository.searchProductsByUser(keyword);
    }

    //find 
    static async findAllProducts({ limit = 50, sort = 'ctime',page = 1, filter = { isPublished: true} }) {
        return await ProductRepository.findAllProducts({ limit, sort, page, filter,
            select: ['product_name', 'product_thumb', 'product_price', 'product_slug', 'product_ratingsAvg'] 
        });
    }
}

class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_slug,
        product_quantity,
        product_type,
        product_atrributes,
        product_shop,
        product_ratingsAvg,
        product_variations,
        isDraft,
        isPublished,
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_slug = product_slug;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_atrributes = product_atrributes;
        this.product_shop = product_shop;
        this.product_ratingsAvg = product_ratingsAvg;
        this.product_variations = product_variations;
        this.isDraft = isDraft;
        this.isPublished = isPublished;
    };

    async createProduct(_id) {
        const newProduct = await product.create({ ...this, _id });
        if(newProduct) {
            await InventoryRepository.createInventory({
                inventory_product: newProduct._id,
                inventory_stock: this.product_quantity,
                inventory_shop: this.product_shop
            });
        }
        return newProduct;
    }

    async updateProduct(productId, data) {
        const  payload = removeUndefinedValues(data);
        return await ProductRepository.updateProductById({
            productId,
            data: payload,
            model: product
        });
    }
}

class Clothing extends Product {
    async createProduct() {
        try {
            const session = await mongoose.startSession();
            session.startTransaction();
            const newClothing = await clothing.create(  {
                ... this.product_atrributes,
                product_shop: this.product_shop      
            });
            if(!newClothing) return new BadRequestError('Error: Create clothing failed');
    
            const newProduct = super.createProduct(newClothing._id);
            if(!newProduct) return new BadRequestError('Error: Create product failed');

            await session.commitTransaction();
            await session.endSession();
            return newProduct;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(productId, data) {
        const objParams = this;
        const payload = removeUndefinedValues(data.product_atrributes);

        if(objParams.product_atrributes)
        {
            console.log('objParams::', objParams);
            await ProductRepository.updateProductById({ 
                productId,
                data: payload,
                model: clothing
            });
        }
        return await super.updateProduct(productId, updateNestedObject(data));
    }
}

class Electronic extends Product {
    async createProduct() {
        try {
            const session = await mongoose.startSession();
            session.startTransaction();
            const newElectronics = await electronic.create({
                ...this.product_atrributes,
                product_shop: this.product_shop
            });
            if(!newElectronics) return new BadRequestError('Error: Create electronics failed');
    
            const newProduct = super.createProduct(newElectronics._id);
            if(!newProduct) return new BadRequestError('Error: Create product failed');
            await session.commitTransaction();
            await session.endSession();
            return newProduct;
            
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(productId, data) {
        const objParams = this;
        const payload = removeUndefinedValues(data.product_atrributes);
        
        if(objParams.product_atrributes ) {
            await ProductRepository.updateProductById({
                productId,
                data: payload,
                model: electronic
            });
        }

        // console.log('data::', data);
        // console.log('data1::', updateNestedObject(data));
        return await super.updateProduct(productId, updateNestedObject(data));
    }
}

// register product type
ProductFactory.registerProductType('Clothings', Clothing);
ProductFactory.registerProductType('Electronics', Electronic);

module.exports = ProductFactory;