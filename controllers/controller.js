const compression = require('compression');

global.webduino = require('webduino-js');
require('../webduino-blockly')(global);

var servo 
let lcd1602 
var matrix 
var led 
var dfplayer

const controller = async (req, res) => {
  console.log(req.body)
  component = req.body.component
  boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, async function (board){
    board.samplingInterval = 50 
    if(component === 'door') {
      servo = getServo(board, 16) 
      switch (req.body.operation) {
        case 'open':
          openDoor(req, res, servo) 
          break
        case 'close': 
          closeDoor(req, res, servo)
          break
      }
      } else if(component === 'lcd') {
        lcd1602 = getLCD1602(board, 4, 5, 0x27)
        displayText(req, res, lcd1602)
      } else if(component === 'led matrix') {
        matrix = getMax7219(board, 12, 14, 16) 
        displayMatrix(req, res)
      } else if(component === 'led') {
        led = getLed(board, 0) 
        setLights(req, res, led)
      } else if(component === 'mp3') {
        dfplayer = getDFPlayer(board, 12, 13);
        await delay(2);
        playMP3(req, res, dfplayer)
      } else {
        console.log('component is not found')
        res.status(400).json({error: 'component is not found'})
      }
      console.log('boardReady is done executing')
  })
}

const openDoor = (req, res, servo) => {
  console.log('openDoor is called') 
  servo.angle = 175;
  res.status(200).json({message:'Door is opened'})
}

const closeDoor = (req, res, servo) => {
  console.log('closeDoor is called')
  servo.angle = 90;
  res.status(200).json({message:'Door is closed'})
}

const displayText = async(req, res, lcd1602) => {
  console.log('displayText is called'); 
  const text = JSON.stringify(req.body.message);

  lcd1602.clear();

  let start = 1;
  let end = text.length 
  if(text.length > 16) {
    end = 15
  }
  const displayInterval = setInterval(() => {
    if (start < end) {
      lcd1602.clear(); 
      if(end != text.length - 1) {
        end++ 
      }
      lcd1602.print(text.substring(start, end));
      console.log(text.substring(start, end));
      start++;
    } else {
      lcd1602.clear();
      clearInterval(displayInterval);
      lcd1602.print(' ');  // Clear display at the end
    }
  }, 600);
  res.status(200).json({message:'Text is displayed'})
}


const displayMatrix = (req, res, matrix) => {
  console.log('displayMatrix is called')
  matrix.animateStop();
  matrix.animate(max7219_horse("left",(max7219_alphabet(req.body.message))), 100);
  res.status(200).json({message:'Matrix is displayed'})
}

const setLights = (req, res, led) => {
  console.log('setLights is called')
  if(req.body.operation === 'off') {
    led.off();
    res.status(200).json({message:'light is off'})
  } else if(req.body.operation === 'on') {
    led.on();
    res.status(200).json({message:'light is on'})
  } else if (req.body.operation === 'dim') {
    led.on()
    led.intensity = 0.1
    res.status(200).json({message:'brightness is lowered'})
  } else if (req.body.operation === 'brighten') {
    led.on()
    led.intensity = 1
    res.status(200).json({message:'brightness is raised'})
  } else {
    res.status(400).json({error:'brightness is raised'})
  }
}

const playMP3 = async (req, res, dfplayer) => {
  console.log('playMP3 is called')
  dfplayer.volume(30);
  await dfplayer.play(1);
  res.status(200).json({message:'music is played'})
}

module.exports = { controller }