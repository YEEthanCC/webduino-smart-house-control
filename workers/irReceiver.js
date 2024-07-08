global.webduino = require('webduino-js');
require('../webduino-blockly')(global);
const { parentPort } = require('worker_threads')

const irReceive = () => {
    var irrecv;
    boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, function (board) {
      board.samplingInterval = 250;
      irrecv = getIRRecv(board, 14);
      irrecv.receive(function (val) {
        irrecv.onVal = val;
        parentPort.postMessage({ type: 'irData', data: val })
      }, function () {});
    });
  }

  irReceive()

  parentPort.on('message', (message) => {
    if(message === 'exit') {
        process.exit()
    }
  })