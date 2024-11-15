'use strict'

const redisPubSubService = require("../services/redisPubSub.service");

class InventoryTest {

    constructor() {
        this.subscribePurchaseEvents();
    }
    async updateInventory(channel, message) {
        console.log("update inventory with message: ", message);
    }
    subscribePurchaseEvents() {
        redisPubSubService.subscribe('purchase_events', (channel, message) => {
            this.updateInventory(channel, message);
        });
    }
}

module.exports = new InventoryTest();