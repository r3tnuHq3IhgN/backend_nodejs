'use strict'

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keytoken.service');
const { createTokenPair } = require('../auth/authUltils');
const { getInfoData } = require('../utils');
const RoleShop  = {
    SHOP: 'SHOP',
    EDITOR: 'EDITOR',
    WRITER: 'WRITER',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            console.log(`[S]::signUp::`, {name, email, password});
            const holderShop = await shopModel.findOne({ email }).lean();
            if(holderShop) {
                return {
                    code: '409',
                    message: 'Shop already exists'
                }
            }

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
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                });
                console.log(publicKeyString);

                if(!publicKeyString) {
                    return {
                        code: '500',
                        message: 'Error creating publickey token'
                    }
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
            
        } catch (error) {
            return {
                code: '500',
                message: error.message
            }
            
        }
    }
}

module.exports = AccessService;