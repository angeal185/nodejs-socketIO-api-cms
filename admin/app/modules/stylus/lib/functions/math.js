var utils=require("../utils"),nodes=require("../nodes");module.exports=function(e,t){return utils.assertType(e,"unit","n"),utils.assertString(t,"fn"),new nodes.Unit(Math[t.string](e.val),e.type)};
