var utils=require("../utils"),nodes=require("../nodes");module.exports=function(e){return utils.assertString(e,"string"),new nodes.Literal(e.string)};
