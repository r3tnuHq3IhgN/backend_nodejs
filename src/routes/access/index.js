'use strict'

const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/access.controler.js');
const { asyncHandler } = require('../../auth/checkAuth.js');

// sign up
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.signIn));

module.exports = router;