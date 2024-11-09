'use strict'

const _ = require('lodash');
const { Types } = require('mongoose');

const convertToObjectId = (id) => {
    return new Types.ObjectId(id);
}

const getInfoData = ({ fields = [], object = [] }) => {
    return _.pick(object, fields);
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(item => [item, 1]));
}

const removeUndefinedValues = (object) => {
    return _.pickBy(object, _.identity);
}


// Update nested object for proudct_atrributes
const updateNestedObject = obj => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObject(obj[key]);
            Object.keys(response).forEach(subKey => {
                newObj[`${key}.${subKey}`] = response[subKey];
            });
        } else {
            newObj[key] = obj[key];
        }
    });
    return newObj;
}

module.exports = {
    getInfoData,
    getSelectData,
    removeUndefinedValues,
    updateNestedObject,
    convertToObjectId
}