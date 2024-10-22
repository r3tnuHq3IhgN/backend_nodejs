'use strict'

const apikeyModel = require("../models/apikey.model");
const crypto = require('crypto');
const apiModel = require("../models/apikey.model");

const findById = async (key) => {
    try {
        const objKey = await apikeyModel.findOne({ key, status: true }).lean();
        return objKey;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findById
}