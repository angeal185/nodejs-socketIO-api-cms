var fs = require('fs'),
_ = require('lodash'),
tpl = require('../data/siteTemplates'),
arr = [];

var res = {
  "lang": tpl.lang,
  "meta": tpl.meta,
  "jsonLd": tpl.jsonLd,
  "title": tpl.siteTitle,
  "favicon": tpl.favicon,
  "css": tpl.styles,
  "js": tpl.scripts
}

var jsonLdOut = '<script type="application/ld+json">'+JSON.stringify(res.jsonLd)+'</script>';

var cssOut = _.clone(arr);
 _.forEach(res.css,function(i){
  cssOut.push('<link rel="stylesheet" href="'+i+'">');
});

var jsOut = _.clone(arr);
 _.forEach(res.js,function(i){
  jsOut.push('<script src="'+i+'"></script>');
});

var final = "<!DOCTYPE html><html lang='"+ res.lang +"'><head>" + _.replace(_.toString(res.meta), />,</g, '><') + jsonLdOut + res.title + tpl.favicon + _.replace(_.toString(cssOut), />,</g, '><') +"</head><body>" + _.replace(_.toString(jsOut), />,</g, '><') + "</body></html>";

exports.buildFinal = function(i){
  console.log(final)
  fs.writeFile(i, final, (err) => {
    if (err) throw err;
    console.log('build task success!');
  });
}
