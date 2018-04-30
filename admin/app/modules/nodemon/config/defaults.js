

var directories = [
    '.git',
    '.nyc_output',
    '.sass-cache',
    'bower_components',
    'coverage',
    'node_modules'
  ]

module.exports = {
  ignoreRoot: directories.map(_ => `**/${_}/**`)
};
