var utils=require("../utils"),nodes=require("../nodes");(module.exports=function(){return[].slice.call(arguments).forEach(function(e){e=utils.unwrap(e),e.nodes.length&&console.log("[90minspect:[0m %s",e.toString().replace(/^\(|\)$/g,""))}),nodes.null}).raw=!0;