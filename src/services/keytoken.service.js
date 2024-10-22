'use strict'

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, refreshToken }) => {
        try {
            // const publiKeyString = publicKey.toString();
            // const tokens = await keytokenModel.create({ 
            //     user: userId,
            //     publicKey: publiKeyString,
            // });

            const tokens = await keytokenModel.findOneAndUpdate({ user: userId }, { publicKey, refreshTokenUsed: [], refreshToken }, { upsert: true, new: true });
            console.log('tokens::', tokens);
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = KeyTokenService;
