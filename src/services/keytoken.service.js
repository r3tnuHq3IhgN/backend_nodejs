'use strict'

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            const publiKeyString = publicKey.toString();
            const tokens = await keytokenModel.create({ 
                user: userId,
                publicKey: publiKeyString,
            });
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = KeyTokenService;
