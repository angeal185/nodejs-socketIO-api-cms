var logger=require("../logger"),environment=function(e,n){this.fileManagers=n||[],e=e||{};for(var r=["encodeBase64","mimeLookup","charsetLookup","getSourceMapGenerator"],t=[],i=t.concat(r),a=0;a<i.length;a++){var o=i[a],l=e[o];l?this[o]=l.bind(e):a<t.length&&this.warn("missing required function in environment - "+o)}};environment.prototype.getFileManager=function(e,n,r,t,i){e||logger.warn("getFileManager called with no filename.. Please report this issue. continuing."),null==n&&logger.warn("getFileManager called with null directory.. Please report this issue. continuing.");var a=this.fileManagers;r.pluginManager&&(a=[].concat(a).concat(r.pluginManager.getFileManagers()));for(var o=a.length-1;o>=0;o--){var l=a[o];if(l[i?"supportsSync":"supports"](e,n,r,t))return l}return null},environment.prototype.addFileManager=function(e){this.fileManagers.push(e)},environment.prototype.clearFileManagers=function(){this.fileManagers=[]},module.exports=environment;
