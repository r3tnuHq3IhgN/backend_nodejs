'use strict'

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keytoken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUltils');
const { getInfoData } = require('../utils');
const { ConflictRequestError, InternalServerError, BadRequestError, ForbiddenError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const RoleShop  = {
    SHOP: 'SHOP',
    EDITOR: 'EDITOR',
    WRITER: 'WRITER',
    ADMIN: 'ADMIN'
}

class AccessService {

    static handleRefreshToken = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user;
        if(keyStore.refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenService.removeKeyTokenByUserId(userId);
            throw new ForbiddenError('Something went wrong. Please login again');
        }
        if(keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError('Error: Refresh token not match');
        }

        const foundShop = await findByEmail(email);
        if(!foundShop) throw new AuthFailureError('Error: Shop not found');

        // create new token pair
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);

        // update new refreshToken and add to refreshTokenUsed
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        });

        return {
            shop: getInfoData({ fields: [ 'name', 'email'], object: foundShop }),
            tokens
        }
    }

    static logOut = async (keyStore) => {
        return await KeyTokenService.removeKeyTokenById( keyStore._id);

    }

    static signIn = async ({ email, password, refreshToken = null }) => {

        //1 - Check email exists
        const foundShop = await findByEmail(email);
        if(!foundShop) {
            throw new BadRequestError('Error: Shop not found');
        }
        //2 - Check password match
        const match = await bcrypt.compare(password, foundShop.password);
        if(!match) {
            throw new BadRequestError('Error: Password not match');
        }
        //3 - Create token pair
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        //4 - Return token pair {accessToken, refreshToken}
        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey);

        //5 - Create of update key token
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        });
        return {
            metadata: {
                shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
                tokens
            }
        }
    }

    // sign up
    static signUp = async ({ name, email, password }) => {
            const holderShop = await shopModel.findOne({ email }).lean();

            // step 1: check if shop already exists
            if(holderShop) {
                throw new ConflictRequestError('Error: Shop already exists', 409);
            }

            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const newShop = await shopModel.create({
                name, email, password: hashedPassword, roles: [RoleShop.SHOP]
            });
            if(newShop) {
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem'
                    }
                });

                //const publickeyObject = crypto.createPublicKey(publicKeyString);
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);

                // step 2: create public key token
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                    refreshToken: tokens.refreshToken
                });

                if(!publicKeyString) {
                    throw new InternalServerError('Error creating publickey token');
                }
                console.log('tokens::', tokens);
                return {
                    code: '201',
                    message: 'Shop created successfully',
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                }
            }
            
    }
}

module.exports = AccessService;
