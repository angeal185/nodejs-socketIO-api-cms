var utils=require("../utils"),nodes=require("../nodes");module.exports=function(e,s,t){utils.assertString(e,"val"),utils.assertType(s,"unit","start"),t=t&&t.val;var n=e.string.substr(s.val,t);return e instanceof nodes.Ident?new nodes.Ident(n):new nodes.String(n)};