const fs = require('fs-extra'),
lodash = require('lodash'),
chalk = require('chalk'),
config = require('../config');
const { exec } = require('child_process');

function taskSuccess(a,b,c,d){
  return console.log(chalk.greenBright('[success:'+a+']',chalk.cyanBright(b+c+d)));
}

function taskError(a,b,c,d){
  return console.log(chalk.redBright('[fail:'+a+']',chalk.cyanBright(b+c+d)));
}

exports.install = function(i,e){
  exec(i+' -v', (err, stdout, stderr) => {
      if (err) {
          console.log(chalk.red(`[CustomCMD]: ${stderr}`));
      } else {
        var res = stdout.slice(0,-1);
        config.app.node[i] = res;
        fs.writeFile(urls.config + '.json', JSON.stringify(config,0,2), (err) => {
          if (err) throw err;
        });
      }
  });
}

exports.bowerCopy = function(){
  _.forEach(config.toCopy,function(i){
    fs.copyFile(i.src+i.name, i.dest+i.name, (err) => {
      if (err) {
        taskError(config.installMsg.tasks.copy.name,i.name,config.installMsg.tasks.copy.fail,i.dest);
        throw err;
      } else {
        taskSuccess(config.installMsg.tasks.copy.name,i.name,config.installMsg.tasks.copy.success,i.dest);
      }
    });
  })
}
