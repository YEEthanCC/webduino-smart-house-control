global.webduino = require('webduino-js');
require('./webduino-blockly')(global);
require('dotenv').config() 
const express = require('express')
const cors = require('cors')
const createRoute = require('./routes/route')
const { Worker } = require('worker_threads')

const app = express()
app.use(cors({
    origin: "*"
}))
app.use(express.json())

var servo 
let lcd1602 
var matrix 
var led 
var dfplayer

    
app.use((req, res, next) => {
    console.log(req.path, req.method) 
    next() 
})
app.use('/api', createRoute(servo, lcd1602, matrix, led, dfplayer))
app.listen(process.env.PORT, () => {
    console.log('Listening on port', process.env.PORT)
}) 

// dfplayer test
// const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
// function playTrack(dfplayer, index) {
//     console.log('playTrack is called')
//     return new Promise((resolve, reject) => {
//       dfplayer.play(index, (error) => {
//         if (error) {
//           reject(error); // Reject the promise if there is an error
//         } else {
//           resolve(); // Resolve the promise if the operation is successful
//         }
//       });
//     });
//   }

// var dfplayer;
    
    
// boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, async (board) => {
//     board.samplingInterval = 50;
//     dfplayer = getDFPlayer(board,4, 5);
//     dfplayer.volume(5);
//     console.log(dfplayer)
//     await delay(2);
//     await playTrack(dfplayer, 1)
// });

// connection test 
// function turnOffLed(led) {
//     return new Promise((resolve, reject) => {
//         led.off(() => {
//         resolve();
//         });
//     });
// }

// var led;


// boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, async(board) => {
//   board.samplingInterval = 50;
//   led = getLed(board, 0);
//   await turnOffLed(led)
//   board.disconnect()
// });