const _ = require('lodash'),
nunjucks = require('nunjucks');

exports.njk = function(i,app) {
  var env = new nunjucks.Environment();
  nunjucks.configure(i, {
    autoescape: false,
    trimBlocks: true,
    lstripBlocks: true,
    express: app
  })
  //filters
  .addFilter('camelCase', function(i) {
    return  _.camelCase(i)
  }).addFilter('startCase', function(i) {
    return _.startCase(i)
  })

  nunjucks.installJinjaCompat();
}
