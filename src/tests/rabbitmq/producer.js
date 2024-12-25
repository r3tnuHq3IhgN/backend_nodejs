const req = require("express/lib/request");

const amqp = require('amqplib');

const message = 'TEST MESSAGE';

const runProducer = async () => {
    const connection = await amqp.connect('amqp://admin:admin123@localhost');
    const channel = await connection.createChannel();
    const queue = 'test-queue';

    await channel.assertQueue(queue, { durable: true });
    // Send message to consimer channel
    await channel.sendToQueue(queue, Buffer.from(message));

    console.log(`Message sent: ${message}`);
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
}

runProducer().catch(console.error);