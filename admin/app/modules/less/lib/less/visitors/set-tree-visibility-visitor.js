var SetTreeVisibilityVisitor=function(i){this.visible=i};SetTreeVisibilityVisitor.prototype.run=function(i){this.visit(i)},SetTreeVisibilityVisitor.prototype.visitArray=function(i){if(!i)return i;var t,r=i.length;for(t=0;t<r;t++)this.visit(i[t]);return i},SetTreeVisibilityVisitor.prototype.visit=function(i){return i?i.constructor===Array?this.visitArray(i):!i.blocksVisibility||i.blocksVisibility()?i:(this.visible?i.ensureVisibility():i.ensureInvisibility(),i.accept(this),i):i},module.exports=SetTreeVisibilityVisitor;
