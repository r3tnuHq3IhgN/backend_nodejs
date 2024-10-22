'use strict'

const req = require('express/lib/request');
const { findById } = require('../services/apiKey.service');
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({ 
                message: 'Forbidden' 
            });
        }
        //check objKey
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({ 
                message: 'Forbidden Error' 
            });
        }
        req.objKey = objKey;
        return next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        const { permissions } = req.objKey;
        if (!permissions.includes(permission)) {
            return res.status(403).json({ 
                message: 'Permission denied' 
            });
        }
        if(permission !== 'READ'){
            return res.status(403).json({ 
                message: 'Permission denied (not READ)' 
            });
        }
        return next();
    }
}

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports ={ 
    apiKey,
    permission,
    asyncHandler
}