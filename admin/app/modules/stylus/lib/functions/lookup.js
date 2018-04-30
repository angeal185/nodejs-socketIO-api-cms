var utils=require("../utils"),nodes=require("../nodes");module.exports=function(e){utils.assertType(e,"string","name");var s=this.lookup(e.val);return s?this.visit(s):nodes.null};
