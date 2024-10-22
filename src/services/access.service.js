'use strict'

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keytoken.service');
const { createTokenPair } = require('../auth/authUltils');
const { getInfoData } = require('../utils');
const { ConflictRequestError, InternalServerError, BadRequestError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const RoleShop  = {
    SHOP: 'SHOP',
    EDITOR: 'EDITOR',
    WRITER: 'WRITER',
    ADMIN: 'ADMIN'
}

class AccessService {

    /*
    * 1 - Check email exists
    * 2 - Check password match
    * 3 - Create token pair
    * 4 - Return token pair
    * 5 - Return shop info
    */
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

        //4 - Return token pair
        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey);

        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
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

                // step 2: create public key token
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                });

                if(!publicKeyString) {
                    throw new InternalServerError('Error creating publickey token');
                }
                //const publickeyObject = crypto.createPublicKey(publicKeyString);
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyString, privateKey);
                console.log({tokens});
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