const express = require('express'),
SocketIOFileUpload = require('socketio-file-upload'),
fs = require('fs'),
path = require('path'),
_ = require('lodash'),
utils = require('./admin/app/utils/utils'),
bodyParser = require('body-parser'),
morgan = require('morgan'),
config = require('./admin/app/config/config'),
minifyOutput = require('./admin/app/modules/minifyOutput'),
njk = require('./admin/app/modules/njk').njk,
index = require('./admin/app/routes/index'),
chalk = require('chalk'),
app = express().use(SocketIOFileUpload.router);


//view engine
app.set('view engine', 'njk');
//init nunjucks
njk('admin/views',app)
//log to console
if (config.app.logging.console) {
  app.use(morgan(utils.logConsole));
}
//file logger
if (config.app.logging.file.enabled) {
  app.use(morgan(utils.logFile))
}
//minify app output
if (config.app.minifyOutput) {
	app.use(minifyOutput);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'admin/public')));
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'mobile/www')));
//routes
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error')
});



module.exports = app;
