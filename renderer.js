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
    // ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height); // clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
    objects
        .filter(o => specFilters[o.type])
        .forEach(o => drawObject(o));
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

function selectO() {
    specFilters.O = !specFilters.O;
}
function selectA() {
    specFilters.A = !specFilters.A;
}
function selectB() {
    specFilters.B = !specFilters.B;
}
function selectG() {
    specFilters.G = !specFilters.G;
}
function selectF() {
    specFilters.F = !specFilters.F;
}
function selectK() {
    specFilters.K = !specFilters.K;
}
function selectM() {
    specFilters.M = !specFilters.M;
}

