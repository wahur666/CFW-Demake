const dgram = require('dgram');

const server = dgram.createSocket('udp4');
const PORT = 3333;
const BROADCAST_ADDRESS = '255.255.255.255';

server.on('listening', () => {
    const address = server.address();
    console.log(`Server is running on ${address.address}:${address.port}`);
});

server.bind(PORT, () => {
    server.setBroadcast(true);
});

const message = Buffer.from('Server is running');

setInterval(() => {
    server.send(message, 0, message.length, 3334, BROADCAST_ADDRESS, (err) => {
        if (err) {
            console.error('Error broadcasting message:', err);
        } else {
            console.log('Broadcasted server message');
        }
    });
}, 2000);
