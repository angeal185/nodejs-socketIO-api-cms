var Node=require("./node"),nodes=require("./"),nativeObj={}.constructor,Object=module.exports=function(){Node.call(this),this.vals={}};Object.prototype.__proto__=Node.prototype,Object.prototype.set=function(t,e){return this.vals[t]=e,this},Object.prototype.__defineGetter__("length",function(){return nativeObj.keys(this.vals).length}),Object.prototype.get=function(t){return this.vals[t]||nodes.null},Object.prototype.has=function(t){return t in this.vals},Object.prototype.operate=function(t,e){switch(t){case".":case"[]":return this.get(e.hash);case"==":var n,o,r=this.vals;if("object"!=e.nodeName||this.length!=e.length)return nodes.false;for(var i in r)if(n=r[i],o=e.vals[i],n.operate(t,o).isFalse)return nodes.false;return nodes.true;case"!=":return this.operate("==",e).negate();default:return Node.prototype.operate.call(this,t,e)}},Object.prototype.toBoolean=function(){return nodes.Boolean(this.length)},Object.prototype.toBlock=function(){function t(e){return e.nodes?e.nodes.map(t).join(e.isList?",":" "):"literal"==e.nodeName&&","==e.val?"\\,":e.toString()}var e,n,o="{";for(e in this.vals)if(n=this.get(e),"object"==n.first.nodeName)o+=e+" "+n.first.toBlock();else switch(e){case"@charset":o+=e+" "+n.first.toString()+";";break;default:o+=e+":"+t(n)+";"}return o+="}"},Object.prototype.clone=function(t){var e=new Object;e.lineno=this.lineno,e.column=this.column,e.filename=this.filename;for(var n in this.vals)e.vals[n]=this.vals[n].clone(t,e);return e},Object.prototype.toJSON=function(){return{__type:"Object",vals:this.vals,lineno:this.lineno,column:this.column,filename:this.filename}},Object.prototype.toString=function(){var t={};for(var e in this.vals)t[e]=this.vals[e].toString();return JSON.stringify(t)};
