var path=require("path"),fs=require("./fs"),PromiseConstructor,AbstractFileManager=require("../less/environment/abstract-file-manager.js");try{PromiseConstructor="undefined"==typeof Promise?require("promise"):Promise}catch(e){}var FileManager=function(){};FileManager.prototype=new AbstractFileManager,FileManager.prototype.supports=function(e,t,r,n){return!0},FileManager.prototype.supportsSync=function(e,t,r,n){return!0},FileManager.prototype.loadFile=function(e,t,r,n,o){var a,i,s=this.isPathAbsolute(e),u=[];if(r=r||{},r.syncImport||!PromiseConstructor)return i=this.loadFileSync(e,t,r,n,"utf-8"),void o(i.error,i);var p=s?[""]:[t];return r.paths&&p.push.apply(p,r.paths),s||-1!==p.indexOf(".")||p.push("."),new PromiseConstructor(function(t,r){!function n(o){o<p.length?(a=e,p[o]&&(a=path.join(p[o],a)),fs.stat(a,function(e){e?(u.push(a),n(o+1)):fs.readFile(a,"utf-8",function(e,n){if(e)return void r(e);t({contents:n,filename:a})})})):r({type:"File",message:"'"+e+"' wasn't found. Tried - "+u.join(",")})}(0)})},FileManager.prototype.loadFileSync=function(e,t,r,n,o){var a,i,s,u=[],p=this.isPathAbsolute(e);r=r||{},i=p?[""]:[t],r.paths&&i.push.apply(i,r.paths),p||-1!==i.indexOf(".")||i.push(".");for(var l,f,c=0;c<i.length;c++)try{a=e,i[c]&&(a=path.join(i[c],a)),u.push(a),fs.statSync(a);break}catch(e){a=null}return a?(s=fs.readFileSync(a,o),f={contents:s,filename:a}):(l={type:"File",message:"'"+e+"' wasn't found. Tried - "+u.join(",")},f={error:l}),f},module.exports=FileManager;
