var utils=require("../utils"),nodes=require("../nodes");(module.exports=function(e,s){utils.assertType(e,"expression","name"),e=utils.unwrap(e).first,utils.assertString(e,"name"),utils.assertType(s,"expression","expr");var n=new nodes.Property([e],s),r=this.closestBlock,t=r.nodes.length,i=r.nodes.slice(0,r.index),o=r.nodes.slice(r.index++,t);return i.push(n),r.nodes=i.concat(o),n}).raw=!0;