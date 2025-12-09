import sys, json, uinput

device = uinput.Device([
    uinput.KEY_A, uinput.KEY_B, uinput.KEY_C,   # aggiungi ciò che serve
    uinput.REL_X, uinput.REL_Y,
    uinput.BTN_LEFT, uinput.BTN_RIGHT
])

for line in sys.stdin:
    try:
        msg = json.loads(line.strip())

        if msg["type"] == "key":
            key = getattr(uinput, f"KEY_{msg['key'].upper()}")
            device.emit_click(key)

        elif msg["type"] == "mouse":
            device.emit(uinput.REL_X, msg["dx"])
            device.emit(uinput.REL_Y, msg["dy"])

        elif msg["type"] == "click":
            btn = uinput.BTN_LEFT if msg["button"]=="left" else uinput.BTN_RIGHT
            device.emit_click(btn)

    except:
        pass
