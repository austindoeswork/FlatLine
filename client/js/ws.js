const URL = 'localhost';
const PORT = '8100';

function initWs () {
    const ws = new WebSocket('ws://' + URL + ':' + PORT + '/echo');

    function wssend (ws, cmd) {
        ws.send(JSON.stringify(cmd));
    }

    ws.onopen =  () => {
        let cmd = {
            name: 'Init',
            body: null,
        }

        wssend(ws, cmd);
    }

    ws.onmessage = (data) => {
        try {
            data = JSON.parse(data);
        } catch (e) {
            // console.error('Failed to parse response as JSON');
        }

        if (wsfns[data.type]) {
            wsfns[data.type](data.body);
        } else {
            console.error('Unknown data type: ' + data.type);
        }

    }

    return ws;
}

///////////////////////
// websocket functions
var wsfns = {};

function addWsFn (name, that, fn) {
    wsfns[name] = fn.bind(that);
}

///////////////////////
// websocket commands

var wscmd = {};

function formWs(type, body) {
    return {
        type,
        header: {
            timestamp: new Date().toISOString(),
        },
        body,
    };
}


// actual commands
wscmd.input = function (button, justPressed = false) {
    let body = {
        button,
        justPressed,
    };

    wssend(ws, formWs('init', body));
}
