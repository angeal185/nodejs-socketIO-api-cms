var utils=require("../utils"),nodes=require("../nodes");(module.exports=function(e,r,s){utils.assertPresent(e,"number"),utils.assertPresent(r,"base"),e=utils.unwrap(e).nodes[0].val,r=utils.unwrap(r).nodes[0].val,s=s&&utils.unwrap(s).nodes[0].val||2;for(var n=Number(e).toString(r);n.length<s;)n="0"+n;return new nodes.Literal(n)}).raw=!0;