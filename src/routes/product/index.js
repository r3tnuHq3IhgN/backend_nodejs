'use strict'

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUltils.js');


//search
router.get('/search/:keyword', asyncHandler(productController.searchProductsByUser));

//authentication
router.use(authentication);

// create product
router.post('/create', asyncHandler(productController.createProduct));  
router.get('/drafts', asyncHandler(productController.getAllDraftProductsOfShop));
router.get('/published', asyncHandler(productController.getAllPublishedProductsOfShop));
router.patch('/publish/:productId', asyncHandler(productController.publishedProductByShop));
router.patch('/unpublish/:productId', asyncHandler(productController.unpublishedProductByShop));

module.exports = router;
