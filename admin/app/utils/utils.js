//socket.io
const config = require('../config/config'),
fs = require('fs'),
_ = require('lodash'),
urls = require('../urls'),
notifier = require('node-notifier'),
path = require('path'),
os = require('os'),
morgan = require('morgan'),
socketUtils = require('./socketUtils'),
formatBytes = require('../modules/formatBytes').formatBytes,
modJSON = require('../modules/modJSON'),
logs = require('../logs/logs').logs,
watchFiles = require('../modules/watchFiles').watch,
chalk = require('chalk'),
arr = [],
obj = {};

function getRandomNum(cnt) {
  var rndNum = Math.random();
  rndNum = parseInt(rndNum * cnt);
  return rndNum;
}

exports.updateEditorFiles = function(){
  socketUtils.getfileAdmin();
  socketUtils.getfileApp();
  socketUtils.getfileCompiler();
}

exports.startWatching = function() {

    watchFiles("./dev/admin/css/","./admin/public/css/","css","admin");
    watchFiles("./dev/app/css/","./app/app/css/","css","app");
    watchFiles("./dev/admin/js/","./admin/public/js/","js","admin");
    watchFiles("./dev/app/js/","./app/app/js/","js","app");

    if (config.app.compiler = 'stylus') {
      watchFiles("./dev/app/stylus/","./dev/app/css/","styl","app");
      watchFiles("./dev/admin/stylus/","./dev/admin/css/","styl","admin");
    } else if (config.app.compiler = 'less') {
      watchFiles("./dev/app/less/","./dev/app/css/","less","app");
      watchFiles("./dev/admin/less/","./dev/admin/css/","less","admin");
    }
    
}

exports.passwordGen = function(length) {
  var res = '',
  str = 'qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM!@#$%^&*.,/{}[]:;()<>';
  for (i = 0; i < length; i++) {
    j = getRandomNum(str.length);
    res = res + str.charAt(j);
  }
  return res;
}

exports.osNotify = function(i){
  if (config.app.osNotify){
    notifier.notify({
      title: config.app.name,
      message: i,
      sound: false,
      icon: path.join(process.cwd(), 'admin/public/img/icon.png'),
      wait: true
    });
  }

}

exports.consoleGreen = function(i){
  console.log(chalk.greenBright(i));
}

exports.consoleBlue = function(i){
  console.log(chalk.blueBright(i));
}

exports.initSocketMsg = function(){
  console.log(
    chalk.blueBright('[socketio] '),
    chalk.greenBright('server listening')
  );
}

exports.normalizePort = function(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

exports.updateTimestamp = function(i) {
  var timestamp = i
  var newDate = new Date();
  newDate.setTime(timestamp);
  dateString = newDate.toUTCString();
  document.getElementById("time").innerHTML = dateString;
}

exports.logConsole = function (tokens, req, res) {
  return JSON.stringify(
      console.log(
        chalk.greenBright(tokens.method(req, res))+' '+
        chalk.cyanBright(tokens.url(req, res))+' '+
        chalk.magentaBright(tokens.status(req, res))+' '+
        chalk.magentaBright(tokens.res(req, res, 'content-length')+' '+'-')+' '+
        chalk.magentaBright(tokens['response-time'](req, res)+'ms')
    )
  )
}

exports.logFile = function (tokens, req, res) {
  var toLog = {};
  var timeType = config.app.logging.file.timeType;
  if (timeType === 'year'){
    toLog.time = new Date().toLocaleString();
  } else if (timeType === 'date') {
    toLog.time = new Date().toLocaleDateString();
  } else if (timeType === 'hour') {
    toLog.time = new Date().toLocaleTimeString();
  }
  toLog.method = tokens.method(req, res);
  toLog.url = tokens.url(req, res);
  toLog.status = tokens.status(req, res);
  toLog.size = formatBytes(tokens.res(req, res, 'content-length'),2);
  toLog.resTime = tokens['response-time'](req, res)+'ms';

  if (config.app.logging.file.replace) {
    modJSON.path(urls.logs)
      .modify('logs', toLog);
  } else {
    modJSON.path(urls.logs)
      .add('logs', toLog);
  }

}
