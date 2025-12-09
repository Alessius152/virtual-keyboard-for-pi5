// server.js
//da eseguire sul pi (nel mio caso il pi5)
// server.js
// da eseguire sul Pi
// server.js – Raspberry Pi 5
const net = require('net');
const { spawn } = require('child_process');

const py = spawn('python3', ['uinput_helper.py']);
py.stdin.setEncoding('utf-8');

const server = net.createServer(socket => {
    socket.on('data', data => {
        py.stdin.write(data.toString() + "\n");
    });
});

server.listen(5000, () => {
    console.log("Server in ascolto su 5000");
});
