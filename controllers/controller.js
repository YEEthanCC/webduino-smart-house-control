global.webduino = require('webduino-js');
require('../webduino-blockly')(global);

const controller = (req, res) => {
  console.log(req.body)
  switch (req.body.component) {
    case 'door':
      switch (req.body.operation) {
        case 'open':
          openDoor(req, res) 
          break
        case 'close': 
          closeDoor(req, res)
          break
      }
      break
    case 'lcd':
      displayText(req, res)
      break;
    case 'led matrix': 
      displayMatrix(req, res)
      break
    case 'led': 
      setLights(req, res)
      break
    case 'mp3': 
      playMP3(req, res) 
      break
    default:
      console.log('component is not found')
      res.status(400).json({error: 'component is not found'})
  }
}

const openDoor = (req, res) => {
  console.log('openDoor is called')
    var servo;
    boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, function (board) {
      board.samplingInterval = 50;
      servo = getServo(board, 16);
      servo.angle = 175;
    });
    res.status(200).json({message:'Door is opened'})
    // setTimeout(() => {
    //   boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, function (board) {
    //     board.samplingInterval = 50;
    //     servo = getServo(board, 13);
    //     servo.angle = 90;
    //   });
    // }, "10000")
}

const closeDoor = (req, res) => {
    var servo;
    boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, function (board) {
      board.samplingInterval = 50;
      servo = getServo(board, 16);
      servo.angle = 90;
    });
    res.status(200).json({message:'Door is closed'})
}

const displayText = async(req, res) => {
  console.log('displayText is called');
  let lcd1602;
  const text = JSON.stringify(req.body.message);

  await boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, function (board) {
    board.samplingInterval = 50;
    lcd1602 = getLCD1602(board, 4, 5, 0x27);
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
  });

  res.status(200).json({message:'Text is displayed'})
}


const displayMatrix = (req, res) => {
  console.log('displayMatrix is called')
  var matrix;
  boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, function (board) {
    board.samplingInterval = 250;
    matrix = getMax7219(board, 12, 14, 16);
    matrix.animateStop();
    matrix.animate(max7219_horse("left",(max7219_alphabet(req.body.message))), 100);
  });
  res.status(200).json({message:'Matrix is displayed'})
}

const setLights = (req, res) => {
  console.log('setLights is called')
  if(req.body.operation === 'off') {
    var led;
    boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, function (board) {
      board.samplingInterval = 50;
      led = getLed(board, 0);
      led.off();
      res.status(200).json({message:'light is off'})
    });
  } else if(req.body.operation === 'on') {
    var led;
    boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, function (board) {
      board.samplingInterval = 50;
      led = getLed(board, 0);
      led.on();
      res.status(200).json({message:'light is on'})
    });
  } else if (req.body.operation === 'dim') {
    boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, function (board) {
      board.samplingInterval = 50;
      led = getLed(board, 0);
      led.on()
      led.intensity = 0.1
      res.status(200).json({message:'brightness is lowered'})
    });
  } else if (req.body.operation === 'brighten') {
    boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, function (board) {
      board.samplingInterval = 50;
      led = getLed(board, 0);
      led.on()
      led.intensity = 1
      res.status(200).json({message:'brightness is raised'})
    });
  } else {
    res.status(400).json({error:'brightness is raised'})
  }
}

const playMP3 = (req, res) => {
  var dfplayer
  boardReady({board: 'Smart', device: 'P4eMd', transport: 'mqtt'}, function (board) {
    board.samplingInterval = 50;
    dfplayer = getDFPlayer(board,13,12);
    dfplayer.volume(30);
    dfplayer.play(1)
    // const startPlay = function () {
    //   dfplayer.stop()
    //   dfplayer.play(1)
    //   res.status(200).json({message:'music is played'})
    // }
    // startPlay()
    // await dfplayer.stop();
    // res.status(200).json({message:'music is played'})
    // return
  });
}

function buzzer_music(m) {
  var musicNotes = {};
  musicNotes.notes = [];
  musicNotes.tempos = [];
  if (m[0].notes.length > 1) {
    for (var i = 0; i < m.length; i++) {
      if (Array.isArray(m[i].notes)) {
        var cn = musicNotes.notes.concat(m[i].notes);
        musicNotes.notes = cn;
      } else {
        musicNotes.notes.push(m[i].notes);
      }
      if (Array.isArray(m[i].tempos)) {
        var ct = musicNotes.tempos.concat(m[i].tempos);
        musicNotes.tempos = ct;
      } else {
        musicNotes.tempos.push(m[i].tempos);
      }
    }
  } else {
    musicNotes.notes = [m[0].notes];
    musicNotes.tempos = [m[0].tempos];
  }
  return musicNotes;
}

module.exports = { controller }