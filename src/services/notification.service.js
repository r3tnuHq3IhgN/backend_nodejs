'use strict'

const { NOTI } = require('../models/notification.model');

const pushNotiToSystem = async ({
    noti_type,
    noti_sender_id,
    noti_receiver_id,
    noti_options
}) => {
    // Do something
    let noti_content = '';
    if(noti_type === 'Order-001') {
        // Send notification to system
        noti_content = `Order created by ${noti_sender_id}`;
    }
    if(noti_type === 'Order-002') {
        // Send notification to system
        noti_content = `Order failed by ${noti_sender_id}`;

    }
    if(noti_type === 'Promotion-001') {
        // Send notification to system
        noti_content = `Promotion created by ${noti_sender_id}`;
    }
    if(noti_type === 'Shop-001') {
        // Send notification to system
        noti_content = `New product created by ${noti_sender_id}`;
    }
    return await NOTI.create({
        noti_type,
        noti_sender_id,
        noti_receiver_id,
        noti_content,
        noti_options
    });
}

const listenNotiByUserId = async ({
    userId,
    noti_type = 'ALL',
    limit = 10,
}) => {
    const match = {
        noti_receiver_id: userId
    };
    if(noti_type !== 'ALL') {
        match.noti_type = noti_type;
    }
    return await NOTI.find(match).limit(limit);
}

module.exports = {
    pushNotiToSystem,
    listenNotiByUserId
}