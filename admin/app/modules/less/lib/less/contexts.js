var contexts={};module.exports=contexts;var copyFromOriginal=function(t,s,e){if(t)for(var r=0;r<e.length;r++)t.hasOwnProperty(e[r])&&(s[e[r]]=t[e[r]])},parseCopyProperties=["paths","relativeUrls","rootpath","strictImports","insecure","dumpLineNumbers","compress","syncImport","chunkInput","mime","useFileCache","processImports","pluginManager"];contexts.Parse=function(t){copyFromOriginal(t,this,parseCopyProperties),"string"==typeof this.paths&&(this.paths=[this.paths])};var evalCopyProperties=["paths","compress","ieCompat","strictMath","strictUnits","sourceMap","importMultiple","urlArgs","javascriptEnabled","pluginManager","importantScope"];contexts.Eval=function(t,s){copyFromOriginal(t,this,evalCopyProperties),"string"==typeof this.paths&&(this.paths=[this.paths]),this.frames=s||[],this.importantScope=this.importantScope||[]},contexts.Eval.prototype.inParenthesis=function(){this.parensStack||(this.parensStack=[]),this.parensStack.push(!0)},contexts.Eval.prototype.outOfParenthesis=function(){this.parensStack.pop()},contexts.Eval.prototype.isMathOn=function(){return!this.strictMath||this.parensStack&&this.parensStack.length},contexts.Eval.prototype.isPathRelative=function(t){return!/^(?:[a-z-]+:|\/|#)/i.test(t)},contexts.Eval.prototype.normalizePath=function(t){var s,e=t.split("/").reverse();for(t=[];0!==e.length;)switch(s=e.pop()){case".":break;case"..":0===t.length||".."===t[t.length-1]?t.push(s):t.pop();break;default:t.push(s)}return t.join("/")};