'use strict'

const { order } = require('../order.model');

class OrderRepository {

    static async createOrder(data) {
        return await order.create(data);
    }
}

module.exports = OrderRepository;