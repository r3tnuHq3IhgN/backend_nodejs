'use strict'
const mongoose = require('mongoose');
const { db: { host, port, name} } = require('../configs/config.mongodb');
const countNumber = require('../helpers/check.connect.js');

const MONGO_USER = process.env.MONGO_INITDB_ROOT_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;

//mongodb://root:abcd@1234@localhost:27017/mydatabase?authSource=admin
const connectStr = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${host}:${port}/${name}?authSource=admin`;
//const connectStr = 'mongodb://root:abcd%401234@localhost:27017/mydatabase?authSource=admin';
mongoose.set('debug', true);

class Database {
    constructor() {
        this._connect();
    }
    _connect() {
        mongoose.connect(connectStr).then(() => {
            console.log(connectStr);
            console.log('MongoDB connected with: ' + countNumber.countConnect() + ' connections');
        }).catch(err => {
            console.error(err);
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
const db = Database.getInstance();
module.exports = db;