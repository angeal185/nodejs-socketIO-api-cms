var Node=require("./node"),getDebugInfo=require("./debug-info"),Comment=function(e,t,o,n){this.value=e,this.isLineComment=t,this.currentFileInfo=n,this.allowRoot=!0};Comment.prototype=new Node,Comment.prototype.type="Comment",Comment.prototype.genCSS=function(e,t){this.debugInfo&&t.add(getDebugInfo(e,this),this.currentFileInfo,this.index),t.add(this.value)},Comment.prototype.isSilent=function(e){var t=e.compress&&"!"!==this.value[2];return this.isLineComment||t},module.exports=Comment;
