var utils=require("../utils"),path=require("path");module.exports=function(r){return utils.assertString(r,"path"),path.dirname(r.val).replace(/\\/g,"/")};
