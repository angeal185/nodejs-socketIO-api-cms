var PluginManager=function(s){this.less=s,this.visitors=[],this.preProcessors=[],this.postProcessors=[],this.installedPlugins=[],this.fileManagers=[]};PluginManager.prototype.addPlugins=function(s){if(s)for(var r=0;r<s.length;r++)this.addPlugin(s[r])},PluginManager.prototype.addPlugin=function(s){this.installedPlugins.push(s),s.install(this.less,this)},PluginManager.prototype.addVisitor=function(s){this.visitors.push(s)},PluginManager.prototype.addPreProcessor=function(s,r){var o;for(o=0;o<this.preProcessors.length&&!(this.preProcessors[o].priority>=r);o++);this.preProcessors.splice(o,0,{preProcessor:s,priority:r})},PluginManager.prototype.addPostProcessor=function(s,r){var o;for(o=0;o<this.postProcessors.length&&!(this.postProcessors[o].priority>=r);o++);this.postProcessors.splice(o,0,{postProcessor:s,priority:r})},PluginManager.prototype.addFileManager=function(s){this.fileManagers.push(s)},PluginManager.prototype.getPreProcessors=function(){for(var s=[],r=0;r<this.preProcessors.length;r++)s.push(this.preProcessors[r].preProcessor);return s},PluginManager.prototype.getPostProcessors=function(){for(var s=[],r=0;r<this.postProcessors.length;r++)s.push(this.postProcessors[r].postProcessor);return s},PluginManager.prototype.getVisitors=function(){return this.visitors},PluginManager.prototype.getFileManagers=function(){return this.fileManagers},module.exports=PluginManager;