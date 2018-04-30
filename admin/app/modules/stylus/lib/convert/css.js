function Converter(t){var e=require("css-parse");this.css=t,this.root=e(t,{position:!1}),this.indents=0}module.exports=function(t){return new Converter(t).stylus()},Converter.prototype.stylus=function(){return this.visitRules(this.root.stylesheet.rules)},Converter.prototype.__defineGetter__("indent",function(){return Array(this.indents+1).join("  ")}),Converter.prototype.visit=function(t){switch(t.type){case"rule":case"comment":case"charset":case"namespace":case"media":case"import":case"document":case"keyframes":case"page":case"host":case"supports":return this["visit"+(t.type[0].toUpperCase()+t.type.slice(1))](t)}},Converter.prototype.visitRules=function(t){for(var e="",n=0,i=t.length;n<i;++n)e+=this.visit(t[n]);return e},Converter.prototype.visitMedia=function(t){var e=this.indent+"@media "+t.media;return e+="\n",++this.indents,e+=this.visitRules(t.rules),--this.indents,e},Converter.prototype.visitDeclaration=function(t){return"comment"==t.type?this.visitComment(t):this.indent+t.property+": "+t.value+"\n"},Converter.prototype.visitRule=function(t){var e=this.indent+t.selectors.join(",\n"+this.indent)+"\n";++this.indents;for(var n=0,i=t.declarations.length;n<i;++n)e+=this.visitDeclaration(t.declarations[n]);return--this.indents,e+"\n"},Converter.prototype.visitComment=function(t){return this.indent+"/*"+t.comment+"*/\n"},Converter.prototype.visitCharset=function(t){return this.indent+"@charset "+t.charset+"\n"},Converter.prototype.visitNamespace=function(t){return this.indent+"@namespace "+t.namespace+"\n"},Converter.prototype.visitImport=function(t){return this.indent+"@import "+t.import+"\n"},Converter.prototype.visitDocument=function(t){var e=this.indent+"@"+t.vendor+"document "+t.document;return e+="\n",++this.indents,e+=this.visitRules(t.rules),--this.indents,e},Converter.prototype.visitKeyframes=function(t){var e=this.indent+"@keyframes "+t.name;e+="\n",++this.indents;for(var n=0,i=t.keyframes.length;n<i;++n)e+=this.visitKeyframe(t.keyframes[n]);return--this.indents,e},Converter.prototype.visitKeyframe=function(t){var e=this.indent+t.values.join(", ");e+="\n",++this.indents;for(var n=0,i=t.declarations.length;n<i;++n)e+=this.visitDeclaration(t.declarations[n]);return--this.indents,e},Converter.prototype.visitPage=function(t){var e=this.indent+"@page"+(t.selectors.length?" "+t.selectors.join(", "):"");e+="\n",++this.indents;for(var n=0,i=t.declarations.length;n<i;++n)e+=this.visitDeclaration(t.declarations[n]);return--this.indents,e},Converter.prototype.visitSupports=function(t){var e=this.indent+"@supports "+t.supports;return e+="\n",++this.indents,e+=this.visitRules(t.rules),--this.indents,e},Converter.prototype.visitHost=function(t){var e=this.indent+"@host";return e+="\n",++this.indents,e+=this.visitRules(t.rules),--this.indents,e};
