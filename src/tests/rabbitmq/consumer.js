const amqp = require('amqplib');

const runConsumer = async () => {
    const connection = await amqp.connect('amqp://admin:admin123@localhost');
    const channel = await connection.createChannel();
    const queue = 'test-queue';

    await channel.assertQueue(queue, { durable: true });
    console.log(`Waiting for messages in ${queue}`);

    await channel.consume(queue, (message) => {
        console.log(`Received message: ${message.content.toString()}`);
        channel.ack(message);
    }, {
        ack: true
    });
}

runConsumer().catch(console.error);