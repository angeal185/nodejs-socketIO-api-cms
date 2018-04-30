var nodes=require("../nodes"),rgba=require("./rgba");module.exports=function(e,n){return e=e.rgba,n?rgba(n,new nodes.Unit(e.g),new nodes.Unit(e.b),new nodes.Unit(e.a)):new nodes.Unit(e.r,"")};
