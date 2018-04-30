var Node=require("./node"),Query=module.exports=function(){Node.call(this),this.nodes=[],this.type="",this.predicate=""};Query.prototype.__proto__=Node.prototype,Query.prototype.clone=function(e){var t=new Query;t.predicate=this.predicate,t.type=this.type;for(var i=0,n=this.nodes.length;i<n;++i)t.push(this.nodes[i].clone(e,t));return t.lineno=this.lineno,t.column=this.column,t.filename=this.filename,t},Query.prototype.push=function(e){this.nodes.push(e)},Query.prototype.__defineGetter__("resolvedType",function(){if(this.type)return this.type.nodeName?this.type.string:this.type}),Query.prototype.__defineGetter__("resolvedPredicate",function(){if(this.predicate)return this.predicate.nodeName?this.predicate.string:this.predicate}),Query.prototype.merge=function(e){var t,i,n=new Query,r=this.resolvedPredicate,o=e.resolvedPredicate,s=this.resolvedType,p=e.resolvedType;if(s=s||p,p=p||s,"not"==r^"not"==o){if(s==p)return;t="not"==r?p:s,i="not"==r?o:r}else if("not"==r&&"not"==o){if(s!=p)return;t=s,i="not"}else{if(s!=p)return;t=s,i=r||o}return n.predicate=i,n.type=t,n.nodes=this.nodes.concat(e.nodes),n},Query.prototype.toString=function(){var e=this.predicate?this.predicate+" ":"",t=this.type||"",i=this.nodes.length,n=e+t;return i&&(n+=(t&&" and ")+this.nodes.map(function(e){return e.toString()}).join(" and ")),n},Query.prototype.toJSON=function(){return{__type:"Query",predicate:this.predicate,type:this.type,nodes:this.nodes,lineno:this.lineno,column:this.column,filename:this.filename}};
