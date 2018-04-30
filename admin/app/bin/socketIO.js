#!/usr/bin/env node
var app = require('../../../admin'),
config = require('../config/config'),
socketUtils = require('../utils/socketUtils'),
utils = require('../utils/utils'),
debug = require('debug')('app:server'),
http = require('http'),
server = http.createServer(app),
port = utils.normalizePort(config.app.port),
io = require('socket.io')(server),
fs = require('fs-extra'),
_ = require('lodash'),
urls = require('../urls'),
os = require('os'),
files = require('../data/files'),
watchFiles = require('../modules/watchFiles'),
formatBytes = require('../modules/formatBytes'),
modJSON = require('../modules/modJSON'),
beautify = require('beautify'),
UglifyJS = require("uglify-js"),
CleanCSS = require('clean-css'),
minify = require('html-minifier').minify,
htmlMin = require('../config/htmlMin'),
JSONEdit = require("../modules/JSONEdit"),
listFiles = require('../modules/listFiles'),
posts = require('../data/posts'),
apiData = require('../data/appAPI'),
enc = require('../config/enc'),
chalk = require('chalk'),
versions = require('../urls/versions'),
postTemplates = require('../data/templates'),
gallery = require('../data/gallery'),
links = require('../data/links'),
preload = require('../data/preload'),
siteTplData = require('../data/siteTemplates'),
msg = require('../data/msg'),
logs = require('../logs/logs'),
SocketIOFileUpload = require('socketio-file-upload'),
build = require('../modules/build'),
buildFinal = require('../modules/buildFinal').buildFinal;
helpData = require('../data/helpData'),
{ exec } = require('child_process'),
arr = [],
obj = {};





//build.mergeJs();

//encryptData()

//console.log(utils.passwordGen(100))

//buildFinal('./app/index.html')

socketUtils.backup("app","app/",true)



if (config.app.node.npm === ""){
  _.forEach(["npm","nodemon","node"], function(i) {
    socketUtils.checkV(i);
    });
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

app.set('port', port);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);





//socket.io

io.sockets.on("connection", function(socket){

//socketUtils.testSocket(socket)

  watchFiles.reloadAdmin(socket)
  watchFiles.reloadApp(socket)



  utils.consoleGreen('[socketIO] connected to: '+ chalk.cyanBright(socket.handshake.headers.referer));

  socket.emit('socketOnline');

  function successMsg(i){
    socket.emit("success", i);
    utils.consoleGreen(i)
  }


  //utils.initSocketMsg();
  if (config.app.help){
    socket.on('helpData', function(){
      socket.emit('helpData', helpData);
    });
  }

  socket.on('getEditorFiles', function(){
    socket.emit('getEditorFiles', files);
  });

  socket.on('getStats', function(){
    socket.emit('getStats', socketUtils.stats);
  });

  socket.on('sendTimed', function(){

      var Timed = {
          cpuUser:formatBytes.formatBytes(process.cpuUsage().user,2),
          cpuSystem:formatBytes.formatBytes(process.cpuUsage().system,2),
          freemem: formatBytes.formatBytes(os.freemem(),2),
          totalmem: formatBytes.formatBytes(os.totalmem(),2),
          uptime: process.uptime(),
          nodeMemUsage:formatBytes.formatBytes(process.memoryUsage().rss,2)
        }
      socket.emit('sendTimed', Timed);
  });

  socket.on('upload', function(i){
      var uploader = new SocketIOFileUpload();
      uploader.dir = config.app.uploads;
      uploader.listen(socket);

      uploader.on("saved", function(event){
          console.log(event.file);
      });

      uploader.on("error", function(event){
          console.log("Error from uploader", event);
      });
  });

  socket.on('getVersions', function(i){
    socket.emit('getVersions',versions);
  });

  socket.on('getLogs', function(i){
    socket.emit('getLogs', logs);
    socketUtils.logLimit();
  });

  socket.on('getAPI', function(i){
    socket.emit('getAPI', apiData);
  });

  socket.on('getLinks', function(i){
    socket.emit('getLinks', links);
  });

  socket.on('PUGCommit', function(i){
    socket.emit('PUGCommit', socketUtils.PUGCommit(i));
  });

  socket.on('toPUG', function(i){
    socket.emit('toPUG', socketUtils.toPUG(i));
  });

  socket.on('minifyHtml', function(i){
    socket.emit('minifyHtml', socketUtils.minifyHtml(i));
  });

  socket.on('beautify', function(i){
    socket.emit('beautify', socketUtils.beautify(i));
  });

  socket.on('getPostData', function(i){
    socket.emit('getPostData', posts);
  });

  socket.on('getGallery', function(i){
    socket.emit('getGallery', gallery);
  });

  socket.on('getPreload', function(i){
    socket.emit('getPreload', preload);
  });

  socket.on('updateVersions', function(){
    socketUtils.updateVersions();
    successMsg(msg.updateVersions);
  });

  socket.on('setAPI', function(i){
    socketUtils.setAPI(i);
    successMsg(msg.setAPI);
  });

  socket.on('setLinks', function(i){
    socketUtils.setLinks(i);
  });

  socket.on('setMeta', function(i){
    socketUtils.setMeta(i);
  });

  socket.on('setGallery', function(i){
    socketUtils.setGallery(i);
    successMsg(msg.setAPI);
  });

  socket.on('setPreload', function(i){
    socketUtils.setPreload(i);
    successMsg(msg.setAPI);
  });

  socket.on('postCommit', function(i){
      socketUtils.postCommit(i);
      successMsg(msg.postCommit);
  });

  socket.on('templateCommit', function(i){
      socketUtils.templateCommit(i);
  });

  socket.on('siteTemplateCommit', function(i){
      socketUtils.siteTemplateCommit(i);
  });

  socket.on('postEdit',  function(i){
      socketUtils.postEdit(i);
      successMsg(msg.postEdit);
  });

  socket.on('deletePost', function(i){
      socketUtils.deletePost(i);
      successMsg(msg.deletePost);
  });

  socket.on('deleteTplData', function(i){
      socketUtils.deleteTplData(i);
      successMsg(msg.deletePost);
  });

  socket.on('deleteSiteTplData', function(i){
      socketUtils.deleteSiteTplData(i);
      successMsg(msg.deletePost);
  });

  socket.on('getTplData', function(){
      io.emit('getTplData', postTemplates.postTemplates);
  });

  socket.on('getSiteTplData', function(){
      io.emit('getSiteTplData', siteTplData.templates);
  });

  socket.on('getMeta', function(){
      io.emit('getMeta', siteTplData);
  });


  socket.on('execCmd', function(i){
    console.log(i)
    exec(i, (err, stdout, stderr) => {
        if (err) {
            console.log(chalk.red(`[CustomCMD]: ${stderr}`));
            socket.emit('execCmd',stderr)
        } else {
            console.log(chalk.magenta(`[CustomCMD]`),chalk.green(`[Success]`),chalk.yellow(`${i}: ${stdout}`));
            console.log(_.words(stdout))
            socket.emit('execCmd',stdout)
        }
    });
  });

  socket.on('loadit', function(i){
    socketUtils.loadIt(i,socket)
  });

  socket.on('editorSave', function(i){
      fs.writeFile(i.file, i.data, (err) => {
        if (err) throw err;
        console.log(i.file + ' saved')
      });
  });

  socket.on('minHtml', function(i){
    var data = minify(i, htmlMin);
    socket.emit('loadit', data);
    console.log(data)
  });

  socket.on('uglifyJs', function(i){
    var data = UglifyJS.minify(i);
    if (data.error) {
      res = "error";
    } else {
      res = data.code;
    }
    console.log(data.error);
    socket.emit('loadit', res);
  });

  socket.on('minCss', function(i){
    var data = new CleanCSS().minify(i);
    socket.emit('loadit', data.styles);
    console.log(data)
  });

  socket.on('readGulp', function(i){
    //console.log('elements: ' + i);
    fs.readFile(i.dir+i.ele, 'utf8', function read(err, data) {
      if (err) {
          throw err;
      }
      //console.log(data);
      io.emit('readGulp', {"title":i.ele,"data":data});
    });
  });

  socket.on('AceConfUpdate', function(i){

      fs.writeFile('./admin/app/config/aceConf.json', i, (err) => {
        if (err) throw err;
        console.log('Ace config updated');
      });
      //console.log(data);
      //io.emit('readElements', {"title":i,"data":data});
  });

  socket.on('deleteFile', function(i){
    fs.writeFile(urls.files+'.json', JSON.stringify(i.update,0,2), (err) => {
      if (err) throw err;
      console.log('file list updated');
      fs.unlink(i.remove, (err) => {
        if (err) throw err;
        console.log(i.remove+' deleted');
        })
      })
    });


  socket.on('adminSettings', function(i){
    console.log('adminSettings: ' + i);
      modJSON.path(urls.config)
        .modify('app[port]', parseInt(i.port))
        .modify('app[uploads]', i.uploads)
        .modify('app[exportTo]', i.exportTo)
        .modify('app[debugToolbar]', JSON.parse(i.debug))
        .modify('app[help]', JSON.parse(i.help))
        .modify('app[audio]', JSON.parse(i.audio))
        .modify('app[login]', JSON.parse(i.login))
        .modify('app[minifyOutput]', JSON.parse(i.minifyOutput));
      io.emit('adminSettings', 'success');
  });

});
