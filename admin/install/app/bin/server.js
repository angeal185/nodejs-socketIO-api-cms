const express = require('express'),
app = express(),
http = require('http').Server(app),
io = require('socket.io')(http),
path = require('path'),
bodyParser = require('body-parser'),
fs = require('fs-extra'),
_ = require('lodash'),
chalk = require('chalk'),
config = require('../../../app/config/config'),
njk = require('../../../app/modules/njk').njk,
appConf = require('../config'),
utils = require('../utils');
var arr = [];

app.set('view engine', 'njk');
njk('admin/install/app/views',app)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), 'app/app/'),{strict: false}));
app.use(express.static(path.join(__dirname, '../public/'),{strict: false}));

app.get('/', function(req, res) {
  res.render('index', {
    title: 'install',
    config: {
      styles: appConf.app.styles,
      scripts: appConf.app.scripts,
      compilers: appConf.app.compilers
    }
  });
});




http.listen(config.app.port, function(){
  console.log('listening on *:3000');
});


io.on('connection', function(socket){
  console.log('socketIO connecting');

  socket.emit('config',config)

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
