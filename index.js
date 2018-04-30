const urls = require("./admin/app/urls"),
nodemon = require(urls.nodemon),
_ = require('lodash'),
fs = require("fs-extra"),
path = require("path"),
config = require(urls.config),
utils = require(urls.utils),
session = require(urls.session),
chalk = require('chalk'),
arr = [];

var begin = '['+config.app.name+' v'+config.app.version+'] ';

function nmGreen(i) {
  console.log(chalk.greenBright(begin+i))
}
function nmRed(i) {
  console.log(chalk.redBright(begin+i))
}

function initMsg(a,b) {
  nmGreen(chalk.cyanBright(a+chalk.blue(b)))
}

function initSession() {
  var initMsgs = [{
    "msg":"starting: ",
    "arg": nodemon.config.command.raw.args
  },{
    "msg":"running on port:",
    "arg": config.app.port
  },{
    "msg":"cwd:",
    "arg": nodemon.config.system.cwd
  },{
    "msg":"watching[dir]:",
    "arg": JSON.stringify(_.words(nodemon.config.options.watch))
  },{
    "msg":"watching[ext]:",
    "arg": JSON.stringify(_.words(nodemon.config.options.execOptions.ext))
  }];

  utils.osNotify('Session started');
  _.forEach(initMsgs,function(i){
    initMsg(i.msg,i.arg)
  })
  nmGreen(chalk.cyanBright('type '+ chalk.magentaBright(JSON.stringify(nodemon.config.options.restartable))+' and hit enter to restart server.'))
  session.init = false;
  utils.updateEditorFiles();
  if (config.app.watch){
    utils.startWatching()
  }
  fs.writeFile(urls.session+'.json', JSON.stringify(session,0,2), (err) => {
    if (err) throw err;
    console.log(chalk.greenBright('[session started]'))
  });
}

nodemon({
	"script": urls.socketIO
}).on('start', function () {
	console.log(nodemon.config.options.restartable)
  //console.log(JSON.stringify(nodemon.config,0,2))
  if ((session.init) && (config.app.watch)) {
      initSession();
  }
}).on('quit', function () {
  session.init = true;
  fs.writeFile(urls.session+'.json', JSON.stringify(session,0,2), (err) => {
    if (err) throw err;
    utils.osNotify('Session ended');
    console.log(chalk.redBright('[session ended]'))
    nmRed(chalk.blue('shutdown complete'));
    process.exit();
  });
}).on('restart', function (files) {
  nmRed('restarted due to: '+ chalk.blue(files||'rs command'))
}).on('crash', function () {
  session.init = true;
  fs.writeFile(urls.session+'.json', JSON.stringify(session,0,2), (err) => {
    if (err) throw err;
    console.log(chalk.redBright('script has crashed!'));
    console.log(chalk.redBright('[session reset]'))
  });
});

// force a restart
/*
setTimeout(function(){
  nodemon.emit('restart');
},5000)
*/
