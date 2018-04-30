const fs = require('fs'),
config = require('../config/config'),
_ = require('lodash');

exports.mergeJs = function(){
  var dir = './app/app/js/';
  var final = 'app.min.js';

  fs.copyFileSync('./empty.txt', dir+final);

  _.forEach(config.toMerge,function(item){
    fs.readFile(dir + item, 'utf8', function(err, e) {
      if (err) throw err;

      fs.appendFile(dir+final, e, (err) => {
          if (err) throw err;
          console.log(item+' was appended to app.js');
        });
      });
      console.log(final + ' updated')
  });

}
