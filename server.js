// server.js
//da eseguire sul pi (nel mio caso il pi5)
const net = require('net');
const robot = require('robotjs');

const server = net.createServer((socket) => {
    console.log('Client connesso');

    socket.on('data', (data) => {
        try {
            const event = JSON.parse(data.toString());
            if(event.type === 'keyboard') {
                robot.keyTap(event.key);
            } else if(event.type === 'mouse') {
                robot.moveMouse(event.x, event.y);
                if(event.button) robot.mouseClick(event.button);
            }
        } catch(err) {
            console.error('Errore parsing:', err);
        }
    });

    socket.on('close', () => console.log('Client disconnesso'));
});

server.listen(3000, () => console.log('Server in ascolto su porta 3000'));
