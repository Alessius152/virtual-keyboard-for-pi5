// client.js
//da eseguire sul laptop (nel mio caso windows 11)
const net = require('net');
const ioHook = require('iohook'); // Per shortcut globale e cattura input

const client = net.createConnection({ host: 'IP_DEL_PI', port: 3000 }, () => {
    console.log('Connesso al server');
});

let remoteControl = false;

// Shortcut globale per toggle (es. CTRL+SHIFT+R)
ioHook.registerShortcut([29, 42, 19], (keys) => {
    remoteControl = !remoteControl;
    console.log('Remote control:', remoteControl ? 'ON' : 'OFF');
});

// Cattura eventi tastiera
ioHook.on('keydown', event => {
    if(remoteControl) {
        client.write(JSON.stringify({ type: 'keyboard', key: event.keychar }));
    }
});

// Cattura eventi mouse
ioHook.on('mousemove', event => {
    if(remoteControl) {
        client.write(JSON.stringify({ type: 'mouse', x: event.x, y: event.y }));
    }
});

ioHook.start();
