function render(r,e){return new Renderer(r,e)}var Renderer=require("./renderer"),nodes=require("./nodes"),utils=require("./utils");exports=module.exports=render,exports.version=require("../package").version,exports.nodes=nodes,exports.functions=require("./functions"),exports.utils=require("./utils"),exports.middleware=require("./middleware"),exports.Visitor=require("./visitor"),exports.Parser=require("./parser"),exports.Evaluator=require("./visitor/evaluator"),exports.Normalizer=require("./visitor/normalizer"),exports.Compiler=require("./visitor/compiler"),exports.convertCSS=require("./convert/css"),exports.url=require("./functions/url"),exports.resolver=require("./functions/resolver"),exports.render=function(r,e,o){return"function"==typeof e&&(o=e,e={}),new Renderer(r,e).render(o)};