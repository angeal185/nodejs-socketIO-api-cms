var Node=require("./node"),Function=module.exports=function(n,t,i){Node.call(this),this.name=n,this.params=t,this.block=i,"function"==typeof t&&(this.fn=t)};Function.prototype.__defineGetter__("arity",function(){return this.params.length}),Function.prototype.__proto__=Node.prototype,Function.prototype.__defineGetter__("hash",function(){return"function "+this.name}),Function.prototype.clone=function(n){if(this.fn)var t=new Function(this.name,this.fn);else{var t=new Function(this.name);t.params=this.params.clone(n,t),t.block=this.block.clone(n,t)}return t.lineno=this.lineno,t.column=this.column,t.filename=this.filename,t},Function.prototype.toString=function(){return this.fn?this.name+"("+this.fn.toString().match(/^function *\w*\((.*?)\)/).slice(1).join(", ")+")":this.name+"("+this.params.nodes.join(", ")+")"},Function.prototype.toJSON=function(){var n={__type:"Function",name:this.name,lineno:this.lineno,column:this.column,filename:this.filename};return this.fn?n.fn=this.fn:(n.params=this.params,n.block=this.block),n};