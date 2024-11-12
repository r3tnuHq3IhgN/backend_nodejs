'use strict'

const redis = require('redis');
const { promisify } = require('util');
const redisClient = redis.createClient();
const InventoryRepository = require('../models/repositories/inventory.repo');

// const pexpire = promisify(redisClient.pexpire).bind(redisClient);
// const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

class RedisService {
    static async accquireLock (productId, quantity, cardId) {
        const key = `lock_v2024:${productId}`;
        const retryTimes = 10;
        const expireTime = 1000;
        const isLock = await setnxAsync(key, cardId);
        
        for (let i = 0; i < retryTimes; i++) {
            const result = await setnxAsync(key, expireTime);
            console.log('result', result);
            if (result === 1) {
    
                const isReservation = await InventoryRepository.reservationInventory({
                        productId, quantity, cardId 
                });
                if (isReservation.modifiedCount) {
                    await pexpire(key, expireTime);
                    return key;
                }
                return null;
            } else {
                await pexpire(key, expireTime);
            }
        }
    }
    
    static async releaseLock(key){
        await redisClient.del(key);
    }
}


module.exports = RedisService
