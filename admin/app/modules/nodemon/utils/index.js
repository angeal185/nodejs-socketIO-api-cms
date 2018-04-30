var noop = function () { };
var path = require('path');
const semver = require('semver');
var version = process.versions.node.split('.') || [null, null, null];

var utils = (module.exports = {
  semver: semver,
  satisfies: test => semver.satisfies(process.versions.node, test),
  version: {
    major: parseInt(version[0] || 0, 10),
    minor: parseInt(version[1] || 0, 10),
    patch: parseInt(version[2] || 0, 10),
  },
  clone: require('./clone'),
  merge: require('./merge'),
  bus: require('./bus'),
  isWindows: process.platform === 'win32',
  isMac: process.platform === 'darwin',
  isLinux: process.platform === 'linux',
  isRequired: (function () {
    var p = module.parent;
    while (p) {
      // in electron.js engine it happens
      if (p.filename === undefined) {
        return true;
      }
      if (p.filename.indexOf('bin' + path.sep + 'nodemon.js') !== -1) {
        return false;
      }
      p = p.parent;
    }

    return true;
  })(),
  home: process.env.HOME || process.env.HOMEPATH,
  quiet: function () {

  },
  reset: function () {
    this.debug = false;
  },
  regexpToText: function (t) {
    return t
      .replace(/\.\*\\./g, '*.')
      .replace(/\\{2}/g, '^^')
      .replace(/\\/g, '')
      .replace(/\^\^/g, '\\');
  },
  stringify: function (exec, args) {
    // serializes an executable string and array of arguments into a string
    args = args || [];

    return [exec]
      .concat(
      args.map(function (arg) {
        // if an argument contains a space, we want to show it with quotes
        // around it to indicate that it is a single argument
        if (arg.indexOf(' ') === -1) {
          return arg;
        }
        // this should correctly escape nested quotes
        return JSON.stringify(arg);
      })
      )
      .join(' ')
      .trim();
  },
  undefsafe: function (obj, path, value, __res) {

    function split(path) {
      var res = [];
      var level = 0;
      var key = '';

      for (var i = 0; i < path.length; i++) {
        var c = path.substr(i, 1);

        if (level === 0 && (c === '.' || c === '[')) {
          if (c === '[') {
            level++;
            i++;
            c = path.substr(i, 1);
          }

          if (key) { // the first value could be a string
            res.push(key);
          }
          key = '';
          continue;
        }

        if (c === ']') {
          level--;
          key = key.slice(0, -1);
          continue;
        }

        key += c;
      }

      res.push(key);

      return res;
    }

    // bail if there's nothing
    if (obj === undefined || obj === null) {
      return undefined;
    }

    var parts = split(path);
    var key = null;
    var type = typeof obj;
    var root = obj;
    var parent = obj;

    var star = parts.filter(function (_) { return _ === '*' }).length > 0;

    // we're dealing with a primative
    if (type !== 'object' && type !== 'function') {
      return obj;
    } else if (path.trim() === '') {
      return obj;
    }

    key = parts[0];
    var i = 0;
    for (; i < parts.length; i++) {
      key = parts[i];
      parent = obj;

      if (key === '*') {
        // loop through each property
        var prop = '';
        var res = __res || [];

        for (prop in parent) {
          var shallowObj = undefsafe(obj[prop], parts.slice(i + 1).join('.'), value, res);
          if (shallowObj && shallowObj !== res) {
            if ((value && shallowObj === value) || (value === undefined)) {
              if (value !== undefined) {
                return shallowObj;
              }

              res.push(shallowObj);
            }
          }
        }

        if (res.length === 0) {
          return undefined;
        }

        return res;
      }

      obj = obj[key];
      if (obj === undefined || obj === null) {
        break;
      }
    }

    if (obj === null && i !== parts.length - 1) {
      obj = undefined;
    } else if (!star && value) {
      key = path.split('.').pop();
      parent[key] = value;
    }
    return obj;
  }
});
