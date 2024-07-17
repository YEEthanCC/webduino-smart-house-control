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
    
app.use((req, res, next) => {
    console.log(req.path, req.method) 
    if(req.body.component === 'mp3') {
        var worker = new Worker('./workers/dfplayer.js')
    }
    next() 
})
app.use('/api', createRoute(servo, lcd1602, matrix, led, dfplayer))
app.listen(process.env.PORT, () => {
    console.log('Listening on port', process.env.PORT)
}) 
