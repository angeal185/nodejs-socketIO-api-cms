var utils=require("../utils");module.exports=function(t,e,s){return utils.assertType(t,"string","op"),utils.assertPresent(e,"left"),utils.assertPresent(s,"right"),e.operate(t.val,s)};
