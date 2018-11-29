const electron = require('electron').remote;
const dialog = electron.dialog;
const fs = require('fs');

const objects = [];
const CANVAS_SIZE = {width: 400, height: 400};
var canvas;

function init() {
    canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // objects.push(...[{ x: 10, y: 12, type: 'red' }, { x: 120, y: 172, type: 'blue' }, { x: 300, y: 172, type: 'green' }]);

    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.strokeStyle = 'rgba(0,153,255,0.2)';
    ctx.save();
    setInterval(drawAllObjects, 10);
}

function drawAllObjects() {
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height); // clear canvas
    objects.forEach(o => drawObject(o));
}

function drawObject(object) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = object.type;
    ctx.fillRect(object.x - 1, object.y - 1, 3, 3);
}

function uploadObject() {
    const inputFile = dialog.showOpenDialog({ properties: [ 'openFile', 'openfile' ] });
    console.log(JSON.stringify(inputFile));
    fs.readFile(inputFile[0], (err, data) => {
        if (err) throw err;
        console.log(JSON.parse(data));
        objects.push(...JSON.parse(data));
    });
}