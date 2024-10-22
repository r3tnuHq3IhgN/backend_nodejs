'use strict'

const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/access.controler.js');

// sign up
router.post('/shop/signup', accessController.signUp);

module.exports = router;