module.exports=function(e){var t=require("../tree/quoted"),r=require("../tree/url"),n=require("./function-registry"),i=function(e,t){return new r(t,e.index,e.currentFileInfo).eval(e.context)},a=require("../logger");n.add("data-uri",function(n,s){s||(s=n,n=null);var o=n&&n.value,u=s.value,c=this.currentFileInfo,d=c.relativeUrls?c.currentDirectory:c.entryPath,l=u.indexOf("#"),f="";-1!==l&&(f=u.slice(l),u=u.slice(0,l));var h=e.getFileManager(u,d,this.context,e,!0);if(!h)return i(this,s);var v=!1;if(n)v=/;base64$/.test(o);else{if("image/svg+xml"===(o=e.mimeLookup(u)))v=!1;else{v=["US-ASCII","UTF-8"].indexOf(e.charsetLookup(o))<0}v&&(o+=";base64")}var x=h.loadFileSync(u,d,this.context,e);if(!x.contents)return a.warn("Skipped data-uri embedding of "+u+" because file not found"),i(this,s||n);var g=x.contents;if(v&&!e.encodeBase64)return i(this,s);g=v?e.encodeBase64(g):encodeURIComponent(g);var m="data:"+o+","+g+f;return m.length>=32768&&!1!==this.context.ieCompat?(a.warn("Skipped data-uri embedding of "+u+" because its size ("+m.length+" characters) exceeds IE8-safe 32768 characters!"),i(this,s||n)):new r(new t('"'+m+'"',m,!1,this.index,this.currentFileInfo),this.index,this.currentFileInfo)})};
