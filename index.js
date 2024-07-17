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
    board.samplingInterval = 50 
    servo = getServo(board, 16) 
    lcd1602 = getLCD1602(board, 4, 5, 0x27) 
    matrix = getMax7219(board, 12, 14, 16) 
    led = getLed(board, 0) 
    dfplayer = getDFPlayer(board, 12, 13)
    dfplayer.volume(30);
    
    app.use((req, res, next) => {
        console.log(req.path, req.method) 
        next() 
    })
    app.use('/api', createRoute(servo, lcd1602, matrix, led, dfplayer))
    app.listen(process.env.PORT, () => {
        console.log('Listening on port', process.env.PORT)
    }) 
    console.log('boardReady is done executing')
})