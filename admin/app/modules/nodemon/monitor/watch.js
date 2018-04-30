module.exports.watch = watch;
module.exports.resetWatchers = resetWatchers;

var debug = require('debug')('nodemon:watch');
var debugRoot = require('debug')('nodemon');
var chokidar = require('chokidar');
var config = require('../config');
var path = require('path');
const fs = require('fs');
var utils = require('../utils');
var bus = utils.bus;
var match = require('./match');
var watchers = [];
var debouncedBus;

bus.on('reset', resetWatchers);

function resetWatchers() {
  debugRoot('resetting watchers');
  watchers.forEach(function (watcher) {
    watcher.close();
  });
  watchers = [];
}

function watch() {
  if (watchers.length) {
    debug('early exit on watch, still watching (%s)', watchers.length);
    return;
  }

  var dirs = [].slice.call(config.dirs);

  debugRoot('start watch on: %s', dirs.join(', '));
  const rootIgnored = config.options.ignore;
  debugRoot('ignored', rootIgnored);

  var promises = [];
  var watchedFiles = [];

  dirs.forEach(function (dir) {
    var promise = new Promise(function (resolve) {
      var dotFilePattern = /[/\\]\./;
      var ignored = Array.from(rootIgnored);

      // don't ignore dotfiles if explicitly watched.
      if (!dir.match(dotFilePattern)) {
        ignored.push(dotFilePattern);
      }

      // if the directory is a file, it somehow causes
      // windows to lose the filename upon change
      if (fs.statSync(dir).isFile()) {
        dir = path.dirname(dir);
      }

      var watchOptions = {
        ignorePermissionErrors: true,
        cwd: dir,
        ignored: ignored,
        persistent: true,
        usePolling: config.options.legacyWatch || false,
        interval: config.options.pollingInterval,
      };

      if (utils.isWindows) {
        watchOptions.disableGlobbing = true;
      }

      if (process.env.TEST) {
        watchOptions.useFsEvents = false;
      }

      var watcher = chokidar.watch(
        dir,
        Object.assign({}, watchOptions, config.watchOptions || {})
      );

      watcher.ready = false;

      var total = 0;

      watcher.on('change', filterAndRestart);
      watcher.on('add', function (file) {
        if (watcher.ready) {
          return filterAndRestart(file);
        }

        watchedFiles.push(file);
        watchedFiles = Array.from(new Set(watchedFiles)); // ensure no dupes
        total = watchedFiles.length;
        bus.emit('watching', file);
        debug('watching dir: %s', file);
      });
      watcher.on('ready', function () {
        watcher.ready = true;
        resolve(total);
        debugRoot('watch is complete');
      });

      watcher.on('error', function (error) {
        if (error.code === 'EINVAL') {

        } else {
          process.exit(1);
        }
      });

      watchers.push(watcher);
    });
    promises.push(promise);
  });

  return Promise.all(promises).then(function (res) {
    return watchedFiles;
  });
}

function filterAndRestart(files) {
  if (!Array.isArray(files)) {
    files = [files];
  }
  if (files.length) {
    if (utils.isWindows) {
      // ensure the drive letter is in uppercase (c:\foo -> C:\foo)
      files = files.map(function (f) {
        return f[0].toUpperCase() + f.slice(1);
      });
    }

    var cwd = this.options ? this.options.cwd : process.cwd();

    files = files.map(file => {
      return path.relative(process.cwd(), path.join(cwd, file));
    });

    debug('filterAndRestart on', files);

    var matched = match(
      files,
      config.options.monitor,
      utils.undefsafe(config, 'options.execOptions.ext')
    );

    debug('matched?', JSON.stringify(matched));

    if (config.options.execOptions.script) {
      const script = path.resolve(config.options.execOptions.script);
      if (matched.result.length === 0 && script) {
        const length = script.length;
        files.find(file => {
          if (file.substr(-length, length) === script) {
            matched = {
              result: [file],
              total: 1,
            };
            return true;
          }
        });
      }
    }


    // reset the last check so we're only looking at recently modified files
    config.lastStarted = Date.now();

    if (matched.result.length) {
      if (config.options.delay > 0) {
        if (debouncedBus === undefined) {
          debouncedBus = debounce(restartBus, config.options.delay);
        }
        debouncedBus(matched);
      } else {
        return restartBus(matched);
      }
    }
  }
}

function restartBus(matched) {
  bus.emit('restart', matched.result);
}

function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}
