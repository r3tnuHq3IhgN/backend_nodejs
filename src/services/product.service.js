'use strict'

const { product, clothing, electronic } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
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
        if(!productClass) return new BadRequestError('Error: Product type not found');
        return new productClass(data).createProduct();
    }
}

class Product {
    constructor({
        product_name,product_thumb,product_description,product_price,
        product_quantity,product_type,product_shop,product_atrributes
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_atrributes = product_atrributes;
    }

    async createProduct(_id) {
        return await product.create({ ...this, _id });
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
}

// register product type
ProductFactory.registerProductType('Clothings', Clothing);
ProductFactory.registerProductType('Electronics', Electronic);

module.exports = ProductFactory;