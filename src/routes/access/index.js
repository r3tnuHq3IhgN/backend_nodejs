'use strict'

const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/access.controller.js');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUltils.js');

// sign up
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.signIn));

//authentication
router.use(authentication);

// log out
router.post('/shop/logout', asyncHandler(accessController.logOut));
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken));

module.exports = router;
