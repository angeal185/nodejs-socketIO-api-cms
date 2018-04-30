const fs = require('fs');

function isEmpty(path, fn, callback) {
  if (arguments.length === 2) {
    callback = fn;
    fn = null;
  }

  if (!fs.existsSync(path)) {
    callback(null, false);
    return;
  }

  fs.readdir(path, function(err, files) {
    if (err) {
      callback(err);
      return;
    }

    if (typeof fn === 'function') {
      files = files.filter(fn);
    }

    callback(null, files.length === 0);
  });
}

isEmpty.sync = function(path, fn) {
  if (!fs.existsSync(path)) {
    return false;
  }
  try {
    var files = fs.readdirSync(path);
    if (typeof fn === 'function') {
      files = files.filter(fn);
    }
    return files.length === 0;
  } catch (err) {}
  return false;
};

module.exports = isEmpty;
