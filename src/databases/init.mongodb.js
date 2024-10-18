'use strict'
const mongoose = require('mongoose');
const countNumber = require('../helpers/check.connect.js');
const connectStr = 'mongodb://localhost:27017/test';

class Database {
    constructor() {
        this._connect();
    }
    _connect() {
        mongoose.connect(connectStr, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
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