var Visitor=module.exports=function(t){this.root=t};Visitor.prototype.visit=function(t,i){var o="visit"+t.constructor.name;return this[o]?this[o](t):t};
