var utils=require("../utils"),path=require("path");module.exports=function(t,a){return utils.assertString(t,"path"),path.basename(t.val,a&&a.val)};
