'use strict'

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findKeyToken } = require('../services/keytoken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id'


}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        console.log('publicKey::', publicKey);
        console.log('privateKey::', privateKey);

        // create accessToken and refreshToken
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1d' 
        });
        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1d' 
        });

        // verify accessToken with publicKey
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('err verify::', err);
            }
            else {
                console.log('decode verify::', decode);
            }
        });
        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
}


const authentication =  asyncHandler( async (req, res, next) => {
    // get user_id from header
    const user_id = req.headers[HEADER.CLIENT_ID];
    if (!user_id) throw new AuthFailureError('Invalid request: User not found');

    // find key token by user_id
    const keyStore = await findKeyToken(user_id);
    if (!keyStore) throw new NotFoundError('Key not found');

    // get accessToken from header
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid request: Token not found');

    try {
        // verify accessToken with publicKey and get decodeUser
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (!decodeUser) throw new AuthFailureError('Invalid token');

        // check user_id from header and decodeUser
        if(user_id !== decodeUser.userId) throw new AuthFailureError('Invalid user');
        req.keyStore = keyStore;
        console.log('decodeUser::', decodeUser);
        next();
    } catch (error) {
        throw new AuthFailureError('Invalid token');
    }
});

module.exports = {
    createTokenPair,
    authentication
}
