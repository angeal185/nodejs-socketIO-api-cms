var Node=require("./node"),Ternary=module.exports=function(e,n,r){Node.call(this),this.cond=e,this.trueExpr=n,this.falseExpr=r};Ternary.prototype.__proto__=Node.prototype,Ternary.prototype.clone=function(e){var n=new Ternary;return n.cond=this.cond.clone(e,n),n.trueExpr=this.trueExpr.clone(e,n),n.falseExpr=this.falseExpr.clone(e,n),n.lineno=this.lineno,n.column=this.column,n.filename=this.filename,n},Ternary.prototype.toJSON=function(){return{__type:"Ternary",cond:this.cond,trueExpr:this.trueExpr,falseExpr:this.falseExpr,lineno:this.lineno,column:this.column,filename:this.filename}};
