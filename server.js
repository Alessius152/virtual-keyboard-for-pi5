// server.js
//da eseguire sul pi (nel mio caso il pi5)
// server.js
// da eseguire sul Pi

const net = require('net');
const { keyboard, mouse, Point, Button } = require("@nut-tree-fork/nut-js");

// Impostazioni opzionali (aumentano la velocità)
keyboard.config.autoDelayMs = 0;
mouse.config.autoDelayMs = 0;

const server = net.createServer((socket) => {
    console.log('Client connesso');

    socket.on('data', async (data) => {
        try {
            const event = JSON.parse(data.toString());

            if (event.type === 'keyboard') {
                await keyboard.type(event.key);
            }

            else if (event.type === 'mouse') {
                await mouse.setPosition(new Point(event.x, event.y));

                if (event.button) {
                    const btn =
                        event.button === "left" ? Button.LEFT :
                        event.button === "right" ? Button.RIGHT :
                        Button.MIDDLE;

                    await mouse.click(btn);
                }
            }

        } catch (err) {
            console.error('Errore parsing:', err);
        }
    });

    socket.on('close', () => console.log('Client disconnesso'));
});

server.listen(3000, () => console.log('Server in ascolto su porta 3000'));
