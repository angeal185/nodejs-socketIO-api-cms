var utils=require("../utils"),nodes=require("../nodes"),rgba=require("./rgba");module.exports=function(e,r,n){switch(arguments.length){case 1:utils.assertColor(e);var s=e.rgba;return new nodes.RGBA(s.r,s.g,s.b,1);default:return rgba(e,r,n,new nodes.Unit(1))}};
