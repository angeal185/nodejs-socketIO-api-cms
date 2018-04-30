const nodemon = require("../modules/nodemon"),
chalk = require('chalk');

nodemon({
	"script": "./admin/install/app/bin/server.js"
}).on('start', function () {
	console.log(nodemon.config.options.restartable)
}).on('quit', function () {
    console.log(chalk.redBright('[session ended]'))
    process.exit();
}).on('restart', function (files) {
  console.log(chalk.redBright('restarted due to: '+ chalk.blue(files||'rs command')))
}).on('crash', function () {
    console.log(chalk.redBright('script has crashed!'));
    console.log(chalk.redBright('[session reset]'))
});
