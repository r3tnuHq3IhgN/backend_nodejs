'use strict'

const keytokenModel = require("../models/keytoken.model");
const { Types } = require('mongoose');

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // const publiKeyString = publicKey.toString();
            // const tokens = await keytokenModel.create({ 
            //     user: userId,
            //     publicKey: publiKeyString,
            // });

            const tokens = await keytokenModel.findOneAndUpdate({ user: userId }, { publicKey, privateKey, refreshTokenUsed: [], refreshToken }, { upsert: true, new: true });
            console.log('tokens::', tokens);
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            throw error;
        }
    }

    // find key token by user id
    static findKeyToken = async (userId) => {
        return await keytokenModel.findOne({ user: userId });
    }

    // remove key token by id
    static removeKeyTokenById = async (id) => {
        return await keytokenModel.deleteOne(id);
    }

    static findKeyTokenByRefreshTokenUsed = async ( refreshToken ) => {
        return await keytokenModel.findOne({ refreshTokenUsed: refreshToken });
    }

    static findKeyTokenByRefreshToken = async ( refreshToken ) => {
        return await keytokenModel.findOne({ refreshToken });
    }

    static removeKeyTokenByUserId = async (userId) => {
        return await keytokenModel.findOneAndDelete({ user: userId });
    }

}

module.exports = KeyTokenService;

