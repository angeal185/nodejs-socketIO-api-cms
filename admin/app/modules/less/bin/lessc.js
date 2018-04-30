#!/usr/bin/env node
function printUsage(){less.lesscHelper.printUsage(),pluginLoader.printUsage(plugins),continueProcessing=!1}var path=require("path"),fs=require("../lib/less-node/fs"),os=require("os"),lessConf=require("../../../config/less"),errno,mkdirp;try{errno=require("errno")}catch(e){errno=null}var less=require("../lib/less-node"),pluginLoader=new less.PluginLoader(less),plugin,plugins=[],args=process.argv.slice(1),silent=lessConf.silent,verbose=lessConf.verbose,options={depends:lessConf.depends,compress:lessConf.compress,max_line_len:-1,lint:lessConf.lint,paths:lessConf.paths,color:lessConf.color,strictImports:lessConf.strictImports,insecure:lessConf.insecure,rootpath:lessConf.rootpath,relativeUrls:lessConf.relativeUrls,ieCompat:lessConf.ieCompat,strictMath:lessConf.strictMath,strictUnits:lessConf.strictUnits,globalVars:lessConf.globalVars,modifyVars:lessConf.modifyVars,urlArgs:lessConf.urlArgs,plugins:plugins},sourceMapOptions={},continueProcessing=!0,currentErrorcode;process.on("exit",function(){process.reallyExit(currentErrorcode)});var checkArgFunc=function(e,s){return!!s||(console.error(e+" option requires a parameter"),continueProcessing=!1,currentErrorcode=1,!1)},checkBooleanArg=function(e){var s=/^((on|t|true|y|yes)|(off|f|false|n|no))$/i.exec(e);return s?Boolean(s[2]):(console.error(" unable to parse "+e+" as a boolean. use one of on/t/true/y/yes/off/f/false/n/no"),continueProcessing=!1,currentErrorcode=1,!1)},parseVariableOption=function(e,s){var o=e.split("=",2);s[o[0]]=o[1]},sourceMapFileInline=!1;!function(){if(args=args.filter(function(e){var s;if(s=e.match(/^-I(.+)$/))return options.paths.push(s[1]),!1;if(!(s=e.match(/^--?([a-z][0-9a-z-]*)(?:=(.*))?$/i)))return e;switch(e=s[1]){case"v":case"version":console.log("lessc "+less.version.join(".")+" (Less Compiler) [JavaScript]"),continueProcessing=!1;break;case"verbose":verbose=!0;break;case"s":case"silent":silent=!0;break;case"l":case"lint":options.lint=!0;break;case"strict-imports":options.strictImports=!0;break;case"h":case"help":printUsage();break;case"x":case"compress":options.compress=!0;break;case"insecure":options.insecure=!0;break;case"M":case"depends":options.depends=!0;break;case"max-line-len":checkArgFunc(e,s[2])&&(options.maxLineLen=parseInt(s[2],10),options.maxLineLen<=0&&(options.maxLineLen=-1));break;case"no-color":options.color=!1;break;case"no-ie-compat":options.ieCompat=!1;break;case"no-js":options.javascriptEnabled=!1;break;case"include-path":checkArgFunc(e,s[2])&&(options.paths=s[2].split(os.type().match(/Windows/)?/:(?!\\)|;/:":").map(function(e){if(e)return path.resolve(process.cwd(),e)}));break;case"line-numbers":checkArgFunc(e,s[2])&&(options.dumpLineNumbers=s[2]);break;case"source-map":options.sourceMap=!0,s[2]&&(sourceMapOptions.sourceMapFullFilename=s[2]);break;case"source-map-rootpath":checkArgFunc(e,s[2])&&(sourceMapOptions.sourceMapRootpath=s[2]);break;case"source-map-basepath":checkArgFunc(e,s[2])&&(sourceMapOptions.sourceMapBasepath=s[2]);break;case"source-map-map-inline":sourceMapFileInline=!0,options.sourceMap=!0;break;case"source-map-less-inline":sourceMapOptions.outputSourceFiles=!0;break;case"source-map-url":checkArgFunc(e,s[2])&&(sourceMapOptions.sourceMapURL=s[2]);break;case"rp":case"rootpath":checkArgFunc(e,s[2])&&(options.rootpath=s[2].replace(/\\/g,"/"));break;case"ru":case"relative-urls":options.relativeUrls=!0;break;case"sm":case"strict-math":checkArgFunc(e,s[2])&&(options.strictMath=checkBooleanArg(s[2]));break;case"su":case"strict-units":checkArgFunc(e,s[2])&&(options.strictUnits=checkBooleanArg(s[2]));break;case"global-var":checkArgFunc(e,s[2])&&(options.globalVars||(options.globalVars={}),parseVariableOption(s[2],options.globalVars));break;case"modify-var":checkArgFunc(e,s[2])&&(options.modifyVars||(options.modifyVars={}),parseVariableOption(s[2],options.modifyVars));break;case"url-args":checkArgFunc(e,s[2])&&(options.urlArgs=s[2]);break;case"plugin":var o=s[2].match(/^([^=]+)(=(.*))?/),r=o[1],n=o[3];plugin=pluginLoader.tryLoadPlugin(r,n),plugin?plugins.push(plugin):(console.error("Unable to load plugin "+r+" please make sure that it is installed under or at the same level as less"),currentErrorcode=1);break;default:plugin=pluginLoader.tryLoadPlugin("less-plugin-"+e,s[2]),plugin?plugins.push(plugin):(console.error("Unable to interpret argument "+e+" - if it is a plugin (less-plugin-"+e+"), make sure that it is installed under or at the same level as less"),currentErrorcode=1)}}),continueProcessing){var e=args[1];e&&"-"!=e&&(e=path.resolve(process.cwd(),e));var s=args[2],o=args[2];if(s&&(s=path.resolve(process.cwd(),s)),options.sourceMap)if(sourceMapOptions.sourceMapInputFilename=e,sourceMapOptions.sourceMapFullFilename){if(options.sourceMap&&!sourceMapFileInline){var r=path.resolve(process.cwd(),sourceMapOptions.sourceMapFullFilename),n=path.dirname(r),a=path.dirname(s);sourceMapOptions.sourceMapOutputFilename=path.join(path.relative(n,a),path.basename(s)),sourceMapOptions.sourceMapFilename=path.join(path.relative(a,n),path.basename(sourceMapOptions.sourceMapFullFilename))}}else{if(!s&&!sourceMapFileInline)return console.log("the sourcemap option only has an optional filename if the css filename is given"),void console.log("consider adding --source-map-map-inline which embeds the sourcemap into the css");sourceMapOptions.sourceMapOutputFilename=path.basename(s),sourceMapOptions.sourceMapFullFilename=s+".map",sourceMapOptions.sourceMapFilename=path.basename(sourceMapOptions.sourceMapFullFilename)}if(void 0===sourceMapOptions.sourceMapBasepath&&(sourceMapOptions.sourceMapBasepath=e?path.dirname(e):process.cwd()),void 0===sourceMapOptions.sourceMapRootpath){var i=path.dirname(sourceMapFileInline?s:sourceMapOptions.sourceMapFullFilename||"."),t=path.dirname(sourceMapOptions.sourceMapInputFilename||".");sourceMapOptions.sourceMapRootpath=path.relative(i,t)}if(!e)return console.error("lessc: no input files"),console.error(""),printUsage(),void(currentErrorcode=1);var c=function(e){var s,o=path.dirname(e);if(!(fs.existsSync||path.existsSync)(o)){if(void 0===mkdirp)try{mkdirp=require("mkdirp")}catch(e){mkdirp=null}(s=mkdirp&&mkdirp.sync||fs.mkdirSync)(o)}};if(options.depends){if(!o)return void console.log("option --depends requires an output path to be specified");process.stdout.write(o+": ")}if(!sourceMapFileInline)var p=function(e,s){e=e||"";var o=sourceMapOptions.sourceMapFullFilename;c(o),fs.writeFile(o,e,"utf8",function(e){if(e){var r="Error: ";errno&&errno.errno[e.errno]?r+=errno.errno[e.errno].description:r+=e.code+" "+e.message,console.error("lessc: failed to create file "+o),console.error(r)}else less.logger.info("lessc: wrote "+o);s()})};var l=function(e,s){options.sourceMap&&!sourceMapFileInline?p(e,s):s()},u=function(e,s,o){options.depends?o():e?(c(e),fs.writeFile(e,s.css,{encoding:"utf8"},function(s){if(s){var r="Error: ";errno&&errno.errno[s.errno]?r+=errno.errno[s.errno].description:r+=s.code+" "+s.message,console.error("lessc: failed to create file "+e),console.error(r)}else less.logger.info("lessc: wrote "+e),o()})):options.depends||(process.stdout.write(s.css),o())},f=function(e,s){if(e.depends){for(var o="",r=0;r<s.imports.length;r++)o+=s.imports[r]+" ";console.log(o)}},d=function(o,r){if(o)return console.error("lessc: "+o.message),void(currentErrorcode=1);r=r.replace(/^\uFEFF/,""),options.paths=[path.dirname(e)].concat(options.paths),options.filename=e,options.lint&&(options.sourceMap=!1),sourceMapOptions.sourceMapFileInline=sourceMapFileInline,options.sourceMap&&(options.sourceMap=sourceMapOptions),less.logger.addListener({info:function(e){verbose&&console.log(e)},warn:function(e){silent||console.warn(e)},error:function(e){console.error(e)}}),less.render(r,options).then(function(e){options.lint||u(s,e,function(){l(e.map,function(){f(options,e)})})},function(e){less.writeError(e,options),currentErrorcode=1})};if("-"!=e)fs.readFile(e,"utf8",d);else{process.stdin.resume(),process.stdin.setEncoding("utf8");var m="";process.stdin.on("data",function(e){m+=e}),process.stdin.on("end",function(){d(!1,m)})}}}();