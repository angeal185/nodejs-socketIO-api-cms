function oldJson(e,t,o){function r(e,t){t=t?t+"-":"";for(var i in e){var s=e[i],a=t+i;"object"==typeof s?r(s,a):(s=utils.coerce(s),"string"==s.nodeName&&(s=utils.parseString(s.string)),n.add({name:o+a,val:s}))}}o?(utils.assertString(o,"namePrefix"),o=o.val):o="",t=t?t.toBoolean():new nodes.Boolean(t);var n=t.isTrue?this.currentScope:this.global.scope;r(e)}var utils=require("../utils"),nodes=require("../nodes"),readFile=require("fs").readFileSync;module.exports=function(e,t,o){function r(e,t){var o=new nodes.Object,n=t.get("leave-strings").toBoolean();for(var i in e){var s=e[i];"object"==typeof s?o.set(i,r(s,t)):(s=utils.coerce(s),"string"==s.nodeName&&n.isFalse&&(s=utils.parseString(s.string)),o.set(i,s))}return o}utils.assertString(e,"path"),e=e.string;var n=utils.lookup(e,this.options.paths,this.options.filename),i=t&&"object"==t.nodeName&&t;if(!n){if(i&&i.get("optional").toBoolean().isTrue)return nodes.null;throw new Error("failed to locate .json file "+e)}var s=JSON.parse(readFile(n,"utf8"));if(i)return r(s,i);oldJson.call(this,s,t,o)};
