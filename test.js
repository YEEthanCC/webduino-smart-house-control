global.webduino = require('./webduino-js');
require('../webduino-blockly')(global);

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const repeatPlaying = async() => {
    (async function () {

        var dfplayer;
        
        
        boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, async function (board) {
          board.samplingInterval = 50;
          dfplayer = getDFPlayer(board,4,5);
          dfplayer.volume(5);
          await delay(2);
          dfplayer.play(1);
        });
        
    }());
    await sleep(10000) 
}



