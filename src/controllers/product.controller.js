'use strict'

const ProductService = require('../services/product.service');
const { SuccessResponse } = require('../core/success.response');    

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            'message': 'Create product successfully',
            'metadata': await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }

    getAllDraftProductsOfShop = async (req, res, next) => {
        new SuccessResponse({
            'message': 'Get all draft products successfully',
            'metadata': await ProductService.getAllDraftProductsOfShop(req.user.userId)
        }).send(res);
    }

    getAllPublishedProductsOfShop = async (req, res, next) => {
        new SuccessResponse({
            'message': 'Get all published products successfully',
            'metadata': await ProductService.getAllPublishedProductsOfShop(req.user.userId)
        }).send(res);
    }

    publishedProductByShop = async (req, res, next) => {
        new SuccessResponse({
            'message': 'Published product successfully',
            'metadata': await ProductService.publishedProductByShop(req.user.userId, req.params.productId)
        }).send(res);
    }
    unpublishedProductByShop = async (req, res, next) => {
        new SuccessResponse({
            'message': 'Unpublished product successfully',
            'metadata': await ProductService.unpublishedProductByShop(req.user.userId, req.params.productId)
        }).send(res);
    }

    searchProductsByUser = async (req, res, next) => {
        new SuccessResponse({
            'message': 'Search products successfully',
            'metadata': await ProductService.searchProductsByUser(req.params.keyword)
        }).send(res);
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            'message': 'Find all products successfully',
            'metadata': await ProductService.findAllProducts({
                ...req.query,
                filter: { isPublished: true }
            })
        }).send(res);
    }

    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            'message': 'Update product successfully',
            'metadata': await ProductService.updateProduct(req.params.productId, req.body)
        }).send(res);
    }
}

module.exports = new ProductController();