var utils=require("../utils"),nodes=require("../nodes");module.exports=function(e,n){utils.assertString(e,"delimiter"),utils.assertString(n,"val");for(var s=n.string.split(e.string),t=new nodes.Expression,r=n instanceof nodes.Ident?nodes.Ident:nodes.String,i=0,o=s.length;i<o;++i)t.nodes.push(new r(s[i]));return t};
