const electron = require('electron').remote;
const dialog = electron.dialog;
const fs = require('fs');

const objects = [];
const CANVAS_SIZE = {width: 400, height: 400};
var canvas;

function init() {
    canvas = document.getElementById('canvas');
    setInterval(drawAllObjects, 10);
}

function drawAllObjects() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height); // clear canvas

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);

    objects
        .filter(o => specFilters[o.type])
        .forEach(o => drawObject(o));

    drawAxes(ctx);
}

function drawAxes(ctx) {
    ctx.font = "14px serif";
    ctx.fillStyle = 'white';
    ctx.fillText('RAdeg -->', CANVAS_SIZE.width - 80, CANVAS_SIZE.height - 10);
    ctx.save();
    ctx.rotate(Math.PI*3/2);
    ctx.fillText('DEdeg -->', -70, 17);
    ctx.restore();
}

function drawObject(object) {
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = classColorMap[object.type];

    const pltX = object.x;
    const pltY = object.y * CANVAS_SIZE.height / 180 + CANVAS_SIZE.height / 2;

    ctx.fillRect(pltX, pltY, 1, 1);
}

function uploadObject() {
    const inputFile = dialog.showOpenDialog({properties: ['openFile', 'openfile']});
    console.log(JSON.stringify(inputFile));
    fs.readFile(inputFile[0], (err, data) => {
        if (err) throw err;
        const lines = data.toString().split(/\r?\n/g);
        const transCatalog = lines
            .map(l => l.split('|'))
            .map(arr => {
                return {
                    x: parseFloat(arr[8]),
                    y: parseFloat(arr[9]),
                    type: bvToClass(arr[37])
                }
            });
        objects.push(...transCatalog);
    });
}

const classColorMap = {
    O: '#000099',
    B: '#306050',
    A: '#999999',
    F: '#999900',
    G: '#999010',
    K: '#998000',
    M: '#990000',
};

function bvToClass(bv) {
    if (bv < -0.3) {
        return 'O';
    } else if (bv < -0.02) {
        return 'B';
    } else if (bv < 0.3) {
        return 'A';
    } else if (bv < 0.58) {
        return 'F';
    } else if (bv < 0.81) {
        return 'G';
    } else if (bv < 1.4) {
        return 'K';
    } else {
        return 'M';
    }
}

const specFilters = {
    O: true,
    B: true,
    A: true,
    F: true,
    G: true,
    K: true,
    M: true,
};

function selectType(type) {
    specFilters[type] = !specFilters[type];
}
