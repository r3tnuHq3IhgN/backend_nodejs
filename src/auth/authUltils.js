'use strict'

const JWT = require('jsonwebtoken');
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        console.log('publicKey::', publicKey);
        console.log('privateKey::', privateKey);
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1d' 
        });
        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1d' 
        });

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

module.exports = {
    createTokenPair
}