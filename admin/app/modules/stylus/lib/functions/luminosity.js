var utils=require("../utils"),nodes=require("../nodes");module.exports=function(r){function e(r){return r/=255,.03928>r?r/12.92:Math.pow((r+.055)/1.055,2.4)}return utils.assertColor(r),r=r.rgba,new nodes.Unit(.2126*e(r.r)+.7152*e(r.g)+.0722*e(r.b))};