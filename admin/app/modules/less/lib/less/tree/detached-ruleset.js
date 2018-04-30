var Node=require("./node"),contexts=require("../contexts"),DetachedRuleset=function(e,t){this.ruleset=e,this.frames=t};DetachedRuleset.prototype=new Node,DetachedRuleset.prototype.type="DetachedRuleset",DetachedRuleset.prototype.evalFirst=!0,DetachedRuleset.prototype.accept=function(e){this.ruleset=e.visit(this.ruleset)},DetachedRuleset.prototype.eval=function(e){var t=this.frames||e.frames.slice(0);return new DetachedRuleset(this.ruleset,t)},DetachedRuleset.prototype.callEval=function(e){return this.ruleset.eval(this.frames?new contexts.Eval(e,this.frames.concat(e.frames)):e)},module.exports=DetachedRuleset;
