var Scope=module.exports=function(){this.locals={}};Scope.prototype.add=function(o){this.locals[o.name]=o.val},Scope.prototype.lookup=function(o){return this.locals[o]},Scope.prototype.inspect=function(){var o=Object.keys(this.locals).map(function(o){return"@"+o});return"[Scope"+(o.length?" "+o.join(", "):"")+"]"};
