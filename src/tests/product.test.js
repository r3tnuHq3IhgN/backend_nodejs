'use strict'

const redisPubSubService = require("../services/redisPubSub.service");

class ProductTest {
   async purchaseProduct(productId, quantity) {
        const order = {
            productId,
            quantity
        };

        const result = await redisPubSubService.publish('purchase_events', JSON.stringify(order));
        console.log('purchaseProduct has been publish by purchase_events with message: ', order);

    }

}

module.exports = new ProductTest();