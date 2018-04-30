var Quoted=require("../tree/quoted"),Anonymous=require("../tree/anonymous"),JavaScript=require("../tree/javascript"),functionRegistry=require("./function-registry");functionRegistry.addMultiple({e:function(e){return new Anonymous(e instanceof JavaScript?e.evaluated:e.value)},escape:function(e){return new Anonymous(encodeURI(e.value).replace(/=/g,"%3D").replace(/:/g,"%3A").replace(/#/g,"%23").replace(/;/g,"%3B").replace(/\(/g,"%28").replace(/\)/g,"%29"))},replace:function(e,r,t,a){var n=e.value;return t="Quoted"===t.type?t.value:t.toCSS(),n=n.replace(new RegExp(r.value,a?a.value:""),t),new Quoted(e.quote||"",n,e.escaped)},"%":function(e){for(var r=Array.prototype.slice.call(arguments,1),t=e.value,a=0;a<r.length;a++)t=t.replace(/%[sda]/i,function(e){var t="Quoted"===r[a].type&&e.match(/s/i)?r[a].value:r[a].toCSS();return e.match(/[A-Z]$/)?encodeURIComponent(t):t});return t=t.replace(/%%/g,"%"),new Quoted(e.quote||"",t,e.escaped)}});