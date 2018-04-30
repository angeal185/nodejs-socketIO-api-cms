var Node=require("./node"),FunctionCaller=require("../functions/function-caller"),Call=function(e,t,n,i){this.name=e,this.args=t,this.index=n,this.currentFileInfo=i};Call.prototype=new Node,Call.prototype.type="Call",Call.prototype.accept=function(e){this.args&&(this.args=e.visitArray(this.args))},Call.prototype.eval=function(e){var t,n=this.args.map(function(t){return t.eval(e)}),i=new FunctionCaller(this.name,e,this.index,this.currentFileInfo);if(i.isValid()){try{t=i.call(n)}catch(e){throw{type:e.type||"Runtime",message:"error evaluating function `"+this.name+"`"+(e.message?": "+e.message:""),index:this.index,filename:this.currentFileInfo.filename}}if(null!=t)return t.index=this.index,t.currentFileInfo=this.currentFileInfo,t}return new Call(this.name,n,this.index,this.currentFileInfo)},Call.prototype.genCSS=function(e,t){t.add(this.name+"(",this.currentFileInfo,this.index);for(var n=0;n<this.args.length;n++)this.args[n].genCSS(e,t),n+1<this.args.length&&t.add(", ");t.add(")")},module.exports=Call;
