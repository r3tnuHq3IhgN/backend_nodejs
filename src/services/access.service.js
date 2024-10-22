'use strict'

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keytoken.service');
const { createTokenPair } = require('../auth/authUltils');
const { getInfoData } = require('../utils');
const { ConflictRequestError, InternalServerError } = require('../core/error.response');
const RoleShop  = {
    SHOP: 'SHOP',
    EDITOR: 'EDITOR',
    WRITER: 'WRITER',
    ADMIN: 'ADMIN'
}

class AccessService {
static signUp = async ({ name, email, password }) => {
        console.log(`[S]::signUp::`, {name, email, password});
        const holderShop = await shopModel.findOne({ email }).lean();

        // step 1: check if shop already exists
        if(holderShop) {
            throw new ConflictRequestError('Error: Shop already exists', 409);
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

            // step 2: create public key token
            const publicKeyString = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey
            });
            console.log(publicKeyString);

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