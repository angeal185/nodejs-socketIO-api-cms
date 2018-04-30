var _ = require('lodash'),
debug = require('debug')('nodemon'),
load = require('./load'),
rules = require('../rules'),
utils = require('../utils'),
command = require('./command'),
rulesToMonitor = require('../monitor/match').rulesToMonitor,
bus = utils.bus,
arr = [];


function reset() {
  rules.reset();
  config.dirs = _.clone(arr);
  config.options = { ignore: _.clone(arr), watch: _.clone(arr) };
  config.lastStarted = 0;
  config.loaded = _.clone(arr);
}

var config = {
  run: false,
  system: {
    cwd: process.cwd(),
  },
  required: false,
  dirs: _.clone(arr),
  timeout: 1000,
  options: {},
};


config.load = function (settings, ready) {
  reset();
  var config = this;
  load(settings, config.options, config, function (options) {
    config.options = options;

    if (options.watch.length === 0) {
      // this is to catch when the watch is left blank
      options.watch.push('*.*');
    }

    if (options['watch_interval']) { // jshint ignore:line
      options.watchInterval = options['watch_interval']; // jshint ignore:line
    }

    config.watchInterval = options.watchInterval || null;
    if (options.signal) {
      config.signal = options.signal;
    }

    var cmd = command(config.options);
    config.command = {
      raw: cmd,
      string: utils.stringify(cmd.executable, cmd.args),
    };

    // now run automatic checks on system adding to the config object
    options.monitor = rulesToMonitor(options.watch, options.ignore, config);

    var cwd = process.cwd();
    debug('config: dirs', config.dirs);
    if (config.dirs.length === 0) {
      config.dirs.unshift(cwd);
    }

    bus.emit('config:update', config);
    ready(config);
  });
};

config.reset = reset;

module.exports = config;
