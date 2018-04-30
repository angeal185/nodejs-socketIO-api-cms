var utils=require("../utils");module.exports=function(e,t){return utils.assertType(e,"object","object"),utils.assertString(t,"key"),delete e.vals[t.string],e};
