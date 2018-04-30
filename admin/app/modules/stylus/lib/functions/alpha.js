var nodes=require("../nodes"),rgba=require("./rgba");module.exports=function(e,n){return e=e.rgba,n?rgba(new nodes.Unit(e.r),new nodes.Unit(e.g),new nodes.Unit(e.b),n):new nodes.Unit(e.a,"")};
