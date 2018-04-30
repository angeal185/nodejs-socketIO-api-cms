var Node=require("./node"),Variable=function(e,i,t){this.name=e,this.index=i,this.currentFileInfo=t||{}};Variable.prototype=new Node,Variable.prototype.type="Variable",Variable.prototype.eval=function(e){var i,t=this.name;if(0===t.indexOf("@@")&&(t="@"+new Variable(t.slice(1),this.index,this.currentFileInfo).eval(e).value),this.evaluating)throw{type:"Name",message:"Recursive variable definition for "+t,filename:this.currentFileInfo.filename,index:this.index};if(this.evaluating=!0,i=this.find(e.frames,function(i){var a=i.variable(t);if(a){if(a.important){e.importantScope[e.importantScope.length-1].important=a.important}return a.value.eval(e)}}))return this.evaluating=!1,i;throw{type:"Name",message:"variable "+t+" is undefined",filename:this.currentFileInfo.filename,index:this.index}},Variable.prototype.find=function(e,i){for(var t,a=0;a<e.length;a++)if(t=i.call(e,e[a]))return t;return null},module.exports=Variable;