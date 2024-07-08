const express = require('express')
const { controller } = require('../controllers/controller')
const router = express.Router()

// Open the door
router.post('/',controller)


module.exports = router