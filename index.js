global.webduino = require('webduino-js');
require('./webduino-blockly')(global);
require('dotenv').config() 
const express = require('express')
const cors = require('cors')
const route = require('./routes/route')
const { Worker } = require('worker_threads')

const app = express()

app.use(cors({
    origin: "*"
}))

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method) 
    next() 
})

app.use('/api', route)

app.listen(process.env.PORT, () => {
    console.log('Listening on port', process.env.PORT)
})


// const worker = new Worker('./workers/irReceiver.js')

// worker.on('message', (message) => {
//     if(message.type === 'irData') {
//         console.log('Received IR data from worker:', message.data)
//     }
// })