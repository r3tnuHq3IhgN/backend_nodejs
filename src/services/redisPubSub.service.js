'use strict'

const redis = require('redis');

class RedisPubSubService {
    constructor() {
        this.subscriber = redis.createClient();
        this.publisher = redis.createClient();

        // Kết nối Redis client
        this.connectClients();
    }

    async connectClients() {
        try {
            if (!this.subscriber.isOpen) {
                await this.subscriber.connect();
            }
            if (!this.publisher.isOpen) {
                await this.publisher.connect();
            }
            console.log("Redis clients connected");
        } catch (error) {
            console.error("Error connecting Redis clients", error);
        }
    }

    async publish(channel, message) {
        try {
            if (!this.publisher.isOpen) {
                await this.publisher.connect();
            }

            const result = await this.publisher.publish(channel, message);
            console.log("----------------------");
            console.log(`Published message to channel: ${channel}`);
            console.log(`Message: ${message}`);
            console.log("----------------------");
            return result;
        } catch (error) {
            console.error("Error publishing message:", error);
            throw error;
        }
    }

    subscribe(channel, callback) {
        this.subscriber.subscribe(channel, (message, subscribeChannel) => {
            if (subscribeChannel === channel) {
                callback(channel, message);
            }
            console.log("----------------------");
            console.log(`Received message from channel: ${subscribeChannel}`);
            console.log(`Message: ${message}`);
            console.log("----------------------");
        }
        );
    }
}

module.exports = new RedisPubSubService();
