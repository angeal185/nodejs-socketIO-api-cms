function ImportSequencer(t){this.imports=[],this.variableImports=[],this._onSequencerEmpty=t,this._currentDepth=0}ImportSequencer.prototype.addImport=function(t){var r=this,e={callback:t,args:null,isReady:!1};return this.imports.push(e),function(){e.args=Array.prototype.slice.call(arguments,0),e.isReady=!0,r.tryRun()}},ImportSequencer.prototype.addVariableImport=function(t){this.variableImports.push(t)},ImportSequencer.prototype.tryRun=function(){this._currentDepth++;try{for(;;){for(;this.imports.length>0;){var t=this.imports[0];if(!t.isReady)return;this.imports=this.imports.slice(1),t.callback.apply(null,t.args)}if(0===this.variableImports.length)break;var r=this.variableImports[0];this.variableImports=this.variableImports.slice(1),r()}}finally{this._currentDepth--}0===this._currentDepth&&this._onSequencerEmpty&&this._onSequencerEmpty()},module.exports=ImportSequencer;
