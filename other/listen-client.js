const dgram = require('dgram');

const client = dgram.createSocket('udp4');
const PORT = 3334;

client.on('listening', () => {
    const address = client.address();
    console.log(`Client is listening on ${address.address}:${address.port}`);
});

client.on('message', (message, remote) => {
    console.log(`Received server message: ${message.toString()} from ${remote.address}:${remote.port}`);
});

client.bind(PORT);
