const fs = require('fs'),
_ = require('lodash'),
utils = require('../utils/utils')
config = require("../config/config"),
UglifyJS = require("uglify-js"),
CleanCSS = require('clean-css'),
stylus = require('./stylus'),
less = require('./less'),
chalk = require('chalk');

function logUpdate(i){
  var msg = i + ' updated';
  console.log(chalk.greenBright('[event success] ',chalk.cyanBright(msg)));
  utils.osNotify(msg);
}

exports.watch = function(x,y,z,f){

  var eventSuccess = _.debounce(logUpdate,1000),
  getIn = x,
  getOut = y,
  type = z,
  isOf = f;
  fs.watch(getIn, (eventType, filename) => {

    fs.readFile(getIn + filename, 'utf8', function(err, data) {

      var i,
      res,
      newfile;

    if ((type === 'css') || (type === 'js')) {

      newfile = filename.slice(0,-(type.length))+'min.' + type;

      if (type === 'css') {
        i = new CleanCSS().minify(data);
        var res = i.styles
      }

      else if (type === 'js') {
        console.log(data)
        i = UglifyJS.minify(data,{"mangle":false});

        console.log('js')
        if (i.error) {
          res = "error";
        } else {
          res = i.code;
          console.log(res);
        }
      }

      else if (type === 'js') {
        console.log(data)
        i = UglifyJS.minify(data,{"mangle":false});

        console.log('js')
        if (i.error) {
          res = "error";
        } else {
          res = i.code;
          console.log(res);
        }
      }

      fs.writeFile(getOut+newfile, res, (err) => {
        if (err) throw err;
        eventSuccess(newfile);
      });
    }

    else if (type === 'styl' || 'less') {
      newfile = filename.slice(0,-(type.length))+'css';

      if (type === 'styl') {
      stylus(data)
        .set('paths', [getIn])
        .set('compress', false)
        .render(function(err, e){
          if (err) throw err;
          fs.writeFile(getOut+newfile, e, (err) => {
            if (err) throw err;
            eventSuccess(newfile)
            })
          });
        }
        else if (type === 'less') {
          less.render(data, {compress: false,  yuicompress: false, paths: [getIn]},function(err, output){
            console.log(output)
            fs.writeFile(getOut+newfile, output.css, (err) => {
              if (err) throw err;
              eventSuccess(newfile)
            });
          });
        }
      }
    });
  });
}


var directories = [
    'css',
    'js',
    'data'
  ]

exports.reloadAdmin = function(i){
  var adminWatch = directories.map(_ => `./admin/public/${_}/`)
  _.forEach(adminWatch, function(value) {
    fs.watch(value, (eventType, filename) => {
      i.emit('reloadAdmin')
    });
  });
}

exports.reloadApp = function(i){
  var appWatch = directories.map(_ => `./app/app/${_}/`)
  _.forEach(appWatch, function(value) {
    fs.watch(value, (eventType, filename) => {
      i.emit('reloadApp')
    });
  });
}
