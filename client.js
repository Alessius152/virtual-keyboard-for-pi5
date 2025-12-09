// client.js – Windows 11
const net = require('net');
const ffi = require('ffi-napi');
const ref = require('ref-napi');
const Struct = require('ref-struct-napi');

const HOST = "IP_PI";

// --- Win32 Hooks (low-level mouse/keyboard hook) ---
const user32 = ffi.Library('user32', {
    'SetWindowsHookExA': ['pointer', ['int', 'pointer', 'pointer', 'int']],
    'CallNextHookEx': ['int', ['pointer', 'int', 'int', 'pointer']],
    'GetCursorPos': ['bool', [ 'pointer' ]],
});

const POINT = Struct({
    'x': 'long',
    'y': 'long'
});

const socket = new net.Socket();
socket.connect(5000, HOST);

let enabled = false;

// ogni 20ms invio delta mouse
let last = { x:0, y:0 };
setInterval(() => {
    if (!enabled) return;
    let p = new POINT();
    user32.GetCursorPos(p.ref());
    let dx = p.x - last.x;
    let dy = p.y - last.y;
    last = { x:p.x, y:p.y };
    if (dx!==0 || dy!==0) {
        socket.write(JSON.stringify({type:"mouse", dx, dy})+"\n");
    }
}, 20);

// hook tastiera (via powershell helper)
const { spawn } = require('child_process');
const ps = spawn("powershell.exe", ["-NoProfile", "-Command",
    "$wsh = New-Object -ComObject WScript.Shell;" +
    "while ($true) { $c = $wsh.Popup('',0,'',0x0); }"
]);

// tasti: usa un helper migliore se ti serve la cattura vera
// alternativa: aggiungo un hook nativo Win32 se vuoi

// attiva/disattiva invio con CTRL+ALT+M
process.stdin.on('data', d => {
    if (d.toString().trim() === "switch") {
        enabled = !enabled;
        console.log("modus:", enabled);
    }
});
