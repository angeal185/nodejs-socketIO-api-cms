var utils=require("./utils"),LessError=module.exports=function(t,e,r){Error.call(this);var s=t.filename||r;if(e&&s){var o=e.contents[s],i=utils.getLocation(t.index,o),l=i.line,n=i.column,a=t.call&&utils.getLocation(t.call,o).line,c=o.split("\n");this.type=t.type||"Syntax",this.filename=s,this.index=t.index,this.line="number"==typeof l?l+1:null,this.callLine=a+1,this.callExtract=c[a],this.column=n,this.extract=[c[l-1],c[l],c[l+1]]}this.message=t.message,this.stack=t.stack};if(void 0===Object.create){var F=function(){};F.prototype=Error.prototype,LessError.prototype=new F}else LessError.prototype=Object.create(Error.prototype);LessError.prototype.constructor=LessError;
