global.webduino = require('webduino-js');
require('../webduino-blockly')(global);
const { parentPort } = require('worker_threads')

boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, async function (board) {
    console.log('dfplayer thread is ran')
    dfplayer = getDFPlayer(board, 12, 13)
    console.log('dfplayer is found ')
    dfplayer.volume(30);
    console.log('dfplayer volume is set ')
    await delay(2);
    console.log('dfplayer is waited for 2 sec ')
    dfplayer.play(1);

})