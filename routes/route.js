const express = require('express')
const { createController } = require('../controllers/controller');
const router = express.Router()

// Open the door
const createRouter = (servo, lcd1602, matrix, led, dfplayer) => {
    const router = express.Router()
    const controller = createController(servo, lcd1602, matrix, led, dfplayer) 
    router.post('/',controller)
    return router
}

module.exports = createRouter