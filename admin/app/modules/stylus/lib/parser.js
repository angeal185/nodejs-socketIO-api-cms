var Lexer=require("./lexer"),nodes=require("./nodes"),Token=require("./token"),units=require("./units"),errors=require("./errors"),cache=require("./cache"),debug={lexer:require("debug")("stylus:lexer"),selector:require("debug")("stylus:parser:selector")},selectorTokens=["ident","string","selector","function","comment","boolean","space","color","unit","for","in","[","]","(",")","+","-","*","*=","<",">","=",":","&","&&","~","{","}",".","..","/"],pseudoSelectors=["matches","not","dir","lang","any-link","link","visited","local-link","target","scope","hover","active","focus","drop","current","past","future","enabled","disabled","read-only","read-write","placeholder-shown","checked","indeterminate","valid","invalid","in-range","out-of-range","required","optional","user-error","root","empty","blank","nth-child","nth-last-child","first-child","last-child","only-child","nth-of-type","nth-last-of-type","first-of-type","last-of-type","only-of-type","nth-match","nth-last-match","nth-column","nth-last-column","first-line","first-letter","before","after","selection"],Parser=module.exports=function e(t,s){var i=this;s=s||{},e.cache=e.cache||e.getCache(s),this.hash=e.cache.key(t,s),this.lexer={},e.cache.has(this.hash)||(this.lexer=new Lexer(t,s)),this.prefix=s.prefix||"",this.root=s.root||new nodes.Root,this.state=["root"],this.stash=[],this.parens=0,this.css=0,this.state.pop=function(){i.prevState=[].pop.call(this)}};Parser.getCache=function(e){return!1===e.cache?cache(!1):cache(e.cache||"memory",e)},Parser.prototype={constructor:Parser,currentState:function(){return this.state[this.state.length-1]},previousState:function(){return this.state[this.state.length-2]},parse:function(){var e=this.parent=this.root;if(Parser.cache.has(this.hash))e=Parser.cache.get(this.hash),"block"==e.nodeName&&(e.constructor=nodes.Root);else{for(;"eos"!=this.peek().type&&(this.skipWhitespace(),"eos"!=this.peek().type);){var t=this.statement();this.accept(";"),t||this.error("unexpected token {peek}, not allowed at the root level"),e.push(t)}Parser.cache.set(this.hash,e)}return e},error:function(e){var t=this.peek().type,s=void 0==this.peek().val?"":" "+this.peek().toString();throw s.trim()==t.trim()&&(s=""),new errors.ParseError(e.replace("{peek}",'"'+t+s+'"'))},accept:function(e){if(e==this.peek().type)return this.next()},expect:function(e){return e!=this.peek().type&&this.error('expected "'+e+'", got {peek}'),this.next()},next:function(){var e=this.stash.length?this.stash.pop():this.lexer.next(),t=e.lineno,s=e.column||1;return e.val&&e.val.nodeName&&(e.val.lineno=t,e.val.column=s),nodes.lineno=t,nodes.column=s,debug.lexer("%s %s",e.type,e.val||""),e},peek:function(){return this.lexer.peek()},lookahead:function(e){return this.lexer.lookahead(e)},isSelectorToken:function(e){var t=this.lookahead(e).type;switch(t){case"for":return this.bracketed;case"[":return this.bracketed=!0,!0;case"]":return this.bracketed=!1,!0;default:return~selectorTokens.indexOf(t)}},isPseudoSelector:function(e){var t=this.lookahead(e).val;return t&&~pseudoSelectors.indexOf(t.name)},lineContains:function(e){for(var t,s=1;t=this.lookahead(s++);){if(~["indent","outdent","newline","eos"].indexOf(t.type))return;if(e==t.type)return!0}},selectorToken:function(){if(this.isSelectorToken(1)){if("{"==this.peek().type){if(!this.lineContains("}"))return;for(var e,t=0;e=this.lookahead(++t);){if("}"==e.type){if(2==t||3==t&&"space"==this.lookahead(t-1).type)return;break}if(":"==e.type)return}}return this.next()}},skip:function(e){for(;~e.indexOf(this.peek().type);)this.next()},skipWhitespace:function(){this.skip(["space","indent","outdent","newline"])},skipNewlines:function(){for(;"newline"==this.peek().type;)this.next()},skipSpaces:function(){for(;"space"==this.peek().type;)this.next()},skipSpacesAndComments:function(){for(;"space"==this.peek().type||"comment"==this.peek().type;)this.next()},looksLikeFunctionDefinition:function(e){return"indent"==this.lookahead(e).type||"{"==this.lookahead(e).type},looksLikeSelector:function(e){var t,s=1;if(e&&":"==this.lookahead(s+1).type&&(this.lookahead(s+1).space||"indent"==this.lookahead(s+2).type))return!1;for(;"ident"==this.lookahead(s).type&&("newline"==this.lookahead(s+1).type||","==this.lookahead(s+1).type);)s+=2;for(;this.isSelectorToken(s)||","==this.lookahead(s).type;){if("selector"==this.lookahead(s).type)return!0;if("&"==this.lookahead(s+1).type)return!0;if("."==this.lookahead(s).type&&"ident"==this.lookahead(s+1).type)return!0;if("*"==this.lookahead(s).type&&"newline"==this.lookahead(s+1).type)return!0;if(":"==this.lookahead(s).type&&":"==this.lookahead(s+1).type)return!0;if("color"==this.lookahead(s).type&&"newline"==this.lookahead(s-1).type)return!0;if(this.looksLikeAttributeSelector(s))return!0;if(("="==this.lookahead(s).type||"function"==this.lookahead(s).type)&&"{"==this.lookahead(s+1).type)return!1;if(":"==this.lookahead(s).type&&!this.isPseudoSelector(s+1)&&this.lineContains("."))return!1;if("{"==this.lookahead(s).type?t=!0:"}"==this.lookahead(s).type&&(t=!1),t&&":"==this.lookahead(s).type)return!0;if("space"==this.lookahead(s).type&&"{"==this.lookahead(s+1).type)return!0;if(":"==this.lookahead(s++).type&&!this.lookahead(s-1).space&&this.isPseudoSelector(s))return!0;if("space"==this.lookahead(s).type&&"newline"==this.lookahead(s+1).type&&"{"==this.lookahead(s+2).type)return!0;if(","==this.lookahead(s).type&&"newline"==this.lookahead(s+1).type)return!0}if(","==this.lookahead(s).type&&"newline"==this.lookahead(s+1).type)return!0;if("{"==this.lookahead(s).type&&"newline"==this.lookahead(s+1).type)return!0;if(this.css&&(";"==this.lookahead(s).type||"}"==this.lookahead(s-1).type))return!1;for(;!~["indent","outdent","newline","for","if",";","}","eos"].indexOf(this.lookahead(s).type);)++s;return"indent"==this.lookahead(s).type||void 0},looksLikeAttributeSelector:function(e){var t=this.lookahead(e).type;return!("="!=t||!this.bracketed)||("ident"==t||"string"==t)&&"]"==this.lookahead(e+1).type&&("newline"==this.lookahead(e+2).type||this.isSelectorToken(e+2))&&!this.lineContains(":")&&!this.lineContains("=")},looksLikeKeyframe:function(){var e,t=2;switch(this.lookahead(t).type){case"{":case"indent":case",":return!0;case"newline":for(;"unit"==this.lookahead(++t).type||"newline"==this.lookahead(t).type;);return"indent"==(e=this.lookahead(t).type)||"{"==e}},stateAllowsSelector:function(){switch(this.currentState()){case"root":case"atblock":case"selector":case"conditional":case"function":case"atrule":case"for":return!0}},assignAtblock:function(e){try{e.push(this.atblock(e))}catch(e){this.error("invalid right-hand side operand in assignment, got {peek}")}},statement:function(){var e,t,s=this.stmt(),i=this.prevState;switch(this.allowPostfix&&(this.allowPostfix=!1,i="expression"),i){case"assignment":case"expression":case"function arguments":for(;t=this.accept("if")||this.accept("unless")||this.accept("for");)switch(t.type){case"if":case"unless":s=new nodes.If(this.expression(),s),s.postfix=!0,s.negate="unless"==t.type,this.accept(";");break;case"for":var n,a=this.id().name;this.accept(",")&&(n=this.id().name),this.expect("in");var r=new nodes.Each(a,n,this.expression());e=new nodes.Block(this.parent,r),e.push(s),r.block=e,s=r}}return s},stmt:function(){var e=this.peek().type;switch(e){case"keyframes":return this.keyframes();case"-moz-document":return this.mozdocument();case"comment":case"selector":case"literal":case"charset":case"namespace":case"import":case"require":case"extend":case"media":case"atrule":case"ident":case"scope":case"supports":case"unless":case"function":case"for":case"if":return this[e]();case"return":return this.return();case"{":return this.property();default:if(this.stateAllowsSelector())switch(e){case"color":case"~":case">":case"<":case":":case"&":case"&&":case"[":case".":case"/":return this.selector();case"..":if("/"==this.lookahead(2).type)return this.selector();case"+":return"function"==this.lookahead(2).type?this.functionCall():this.selector();case"*":return this.property();case"unit":if(this.looksLikeKeyframe())return this.selector();case"-":if("{"==this.lookahead(2).type)return this.property()}var t=this.expression();return t.isEmpty&&this.error("unexpected {peek}"),t}},block:function(e,t){var s,i,n,a=this.parent=new nodes.Block(this.parent,e);for(!1===t&&(a.scope=!1),this.accept("newline"),this.accept("{")?(this.css++,s="}",this.skipWhitespace()):(s="outdent",this.expect("indent"));s!=this.peek().type;){if(this.css){if(this.accept("newline")||this.accept("indent"))continue;i=this.statement(),this.accept(";"),this.skipWhitespace()}else{if(this.accept("newline"))continue;if(n=this.lookahead(2).type,"indent"==this.peek().type&&~["outdent","newline","comment"].indexOf(n)){this.skip(["indent","outdent"]);continue}if("eos"==this.peek().type)return a;i=this.statement(),this.accept(";")}i||this.error("unexpected token {peek} in block"),a.push(i)}return this.css?(this.skipWhitespace(),this.expect("}"),this.skipSpaces(),this.css--):this.expect("outdent"),this.parent=a.parent,a},comment:function(){var e=this.next().val;return this.skipSpaces(),e},for:function(){this.expect("for");var e,t=this.id().name;this.accept(",")&&(e=this.id().name),this.expect("in"),this.state.push("for"),this.cond=!0;var s=new nodes.Each(t,e,this.expression());return this.cond=!1,s.block=this.block(s,!1),this.state.pop(),s},return:function(){this.expect("return");var e=this.expression();return e.isEmpty?new nodes.Return:new nodes.Return(e)},unless:function(){this.expect("unless"),this.state.push("conditional"),this.cond=!0;var e=new nodes.If(this.expression(),!0);return this.cond=!1,e.block=this.block(e,!1),this.state.pop(),e},if:function(){this.expect("if"),this.state.push("conditional"),this.cond=!0;var e,t,s=new nodes.If(this.expression());for(this.cond=!1,s.block=this.block(s,!1),this.skip(["newline","comment"]);this.accept("else");){if(!this.accept("if")){s.elses.push(this.block(s,!1));break}this.cond=!0,e=this.expression(),this.cond=!1,t=this.block(s,!1),s.elses.push(new nodes.If(e,t)),this.skip(["newline","comment"])}return this.state.pop(),s},atblock:function(e){return e||this.expect("atblock"),e=new nodes.Atblock,this.state.push("atblock"),e.block=this.block(e,!1),this.state.pop(),e},atrule:function(){var e,t=this.expect("atrule").val,s=new nodes.Atrule(t);return this.skipSpacesAndComments(),s.segments=this.selectorParts(),this.skipSpacesAndComments(),e=this.peek().type,("indent"==e||"{"==e||"newline"==e&&"{"==this.lookahead(2).type)&&(this.state.push("atrule"),s.block=this.block(s),this.state.pop()),s},scope:function(){this.expect("scope");var e=this.selectorParts().map(function(e){return e.val}).join("");return this.selectorScope=e.trim(),nodes.null},supports:function(){this.expect("supports");var e=new nodes.Supports(this.supportsCondition());return this.state.push("atrule"),e.block=this.block(e),this.state.pop(),e},supportsCondition:function(){var e=this.supportsNegation()||this.supportsOp();return e||(this.cond=!0,e=this.expression(),this.cond=!1),e},supportsNegation:function(){if(this.accept("not")){var e=new nodes.Expression;return e.push(new nodes.Literal("not")),e.push(this.supportsFeature()),e}},supportsOp:function(){var e,t,s=this.supportsFeature();if(s){for(t=new nodes.Expression,t.push(s);e=this.accept("&&")||this.accept("||");)t.push(new nodes.Literal("&&"==e.val?"and":"or")),t.push(this.supportsFeature());return t}},supportsFeature:function(){if(this.skipSpacesAndComments(),"("==this.peek().type){var e=this.lookahead(2).type;if("ident"==e||"{"==e)return this.feature();this.expect("(");var t=new nodes.Expression;return t.push(new nodes.Literal("(")),t.push(this.supportsCondition()),this.expect(")"),t.push(new nodes.Literal(")")),this.skipSpacesAndComments(),t}},extend:function(){var e,t,s,i=this.expect("extend"),n=[];do{s=this.selectorParts(),s.length&&(e=new nodes.Selector(s),n.push(e),"!"===this.peek().type&&(i=this.lookahead(2),"ident"===i.type&&"optional"===i.val.name&&(this.skip(["!","ident"]),e.optional=!0)))}while(this.accept(","));return t=new nodes.Extend(n),t.lineno=i.lineno,t.column=i.column,t},media:function(){this.expect("media"),this.state.push("atrule");var e=new nodes.Media(this.queries());return e.block=this.block(e),this.state.pop(),e},queries:function(){var e=new nodes.QueryList,t=["comment","newline","space"];do{this.skip(t),e.push(this.query()),this.skip(t)}while(this.accept(","));return e},query:function(){var e,t,s,i=new nodes.Query;if("ident"==this.peek().type&&("."==this.lookahead(2).type||"["==this.lookahead(2).type))return this.cond=!0,e=this.expression(),this.cond=!1,i.push(new nodes.Feature(e.nodes)),i;if((t=this.accept("ident")||this.accept("not"))&&(t=new nodes.Literal(t.val.string||t.val),this.skipSpacesAndComments(),(s=this.accept("ident"))?(i.type=s.val,i.predicate=t):i.type=t,this.skipSpacesAndComments(),!this.accept("&&")))return i;do{i.push(this.feature())}while(this.accept("&&"));return i},feature:function(){this.skipSpacesAndComments(),this.expect("("),this.skipSpacesAndComments();var e=new nodes.Feature(this.interpolate());return this.skipSpacesAndComments(),this.accept(":"),this.skipSpacesAndComments(),this.inProperty=!0,e.expr=this.list(),this.inProperty=!1,this.skipSpacesAndComments(),this.expect(")"),this.skipSpacesAndComments(),e},mozdocument:function(){this.expect("-moz-document");var e=new nodes.Atrule("-moz-document"),t=[];do{this.skipSpacesAndComments(),t.push(this.functionCall()),this.skipSpacesAndComments()}while(this.accept(","));return e.segments=[new nodes.Literal(t.join(", "))],this.state.push("atrule"),e.block=this.block(e,!1),this.state.pop(),e},import:function(){return this.expect("import"),this.allowPostfix=!0,new nodes.Import(this.expression(),!1)},require:function(){return this.expect("require"),this.allowPostfix=!0,new nodes.Import(this.expression(),!0)},charset:function(){this.expect("charset");var e=this.expect("string").val;return this.allowPostfix=!0,new nodes.Charset(e)},namespace:function(){var e,t;return this.expect("namespace"),this.skipSpacesAndComments(),(t=this.accept("ident"))&&(t=t.val),this.skipSpacesAndComments(),e=this.accept("string")||this.url(),this.allowPostfix=!0,new nodes.Namespace(e,t)},keyframes:function(){var e,t=this.expect("keyframes");return this.skipSpacesAndComments(),e=new nodes.Keyframes(this.selectorParts(),t.val),this.skipSpacesAndComments(),this.state.push("atrule"),e.block=this.block(e),this.state.pop(),e},literal:function(){return this.expect("literal").val},id:function(){var e=this.expect("ident");return this.accept("space"),e.val},ident:function(){for(var e=2,t=this.lookahead(e).type;"space"==t;)t=this.lookahead(++e).type;switch(t){case"=":case"?=":case"-=":case"+=":case"*=":case"/=":case"%=":return this.assignment();case".":if("space"==this.lookahead(e-1).type)return this.selector();if(this._ident==this.peek())return this.id();for(;"="!=this.lookahead(++e).type&&!~["[",",","newline","indent","eos"].indexOf(this.lookahead(e).type););if("="==this.lookahead(e).type)return this._ident=this.peek(),this.expression();if(this.looksLikeSelector()&&this.stateAllowsSelector())return this.selector();case"[":if(this._ident==this.peek())return this.id();for(;"]"!=this.lookahead(e++).type&&"selector"!=this.lookahead(e).type&&"eos"!=this.lookahead(e).type;);if("="==this.lookahead(e).type)return this._ident=this.peek(),this.expression();if(this.looksLikeSelector()&&this.stateAllowsSelector())return this.selector();case"-":case"+":case"/":case"*":case"%":case"**":case"&&":case"||":case">":case"<":case">=":case"<=":case"!=":case"==":case"?":case"in":case"is a":case"is defined":if(this._ident==this.peek())return this.id();switch(this._ident=this.peek(),this.currentState()){case"for":case"selector":return this.property();case"root":case"atblock":case"atrule":return"["==t?this.subscript():this.selector();case"function":case"conditional":return this.looksLikeSelector()?this.selector():this.expression();default:return this.operand?this.id():this.expression()}default:switch(this.currentState()){case"root":return this.selector();case"for":case"selector":case"function":case"conditional":case"atblock":case"atrule":return this.property();default:var s=this.id();return"interpolation"==this.previousState()&&(s.mixin=!0),s}}},interpolate:function(){var e,t,s=[];for(t=this.accept("*"),t&&s.push(new nodes.Literal("*"));;)if(this.accept("{"))this.state.push("interpolation"),s.push(this.expression()),this.expect("}"),this.state.pop();else if(e=this.accept("-"))s.push(new nodes.Literal("-"));else{if(!(e=this.accept("ident")))break;s.push(e.val)}return s.length||this.expect("ident"),s},property:function(){if(this.looksLikeSelector(!0))return this.selector();var e=this.interpolate(),t=new nodes.Property(e),s=t;return this.accept("space"),this.accept(":")&&this.accept("space"),this.state.push("property"),this.inProperty=!0,t.expr=this.list(),t.expr.isEmpty&&(s=e[0]),this.inProperty=!1,this.allowPostfix=!0,this.state.pop(),this.accept(";"),s},selector:function(){var e,t,s=new nodes.Group,i=this.selectorScope,n="root"==this.currentState();do{this.accept("newline"),e=this.selectorParts(),n&&i&&e.unshift(new nodes.Literal(i+" ")),e.length&&(t=new nodes.Selector(e),t.lineno=e[0].lineno,t.column=e[0].column,s.push(t))}while(this.accept(",")||this.accept("newline"));return"selector-parts"==this.currentState()?s.nodes:(this.state.push("selector"),s.block=this.block(s),this.state.pop(),s)},selectorParts:function(){for(var e,t=[];e=this.selectorToken();)switch(debug.selector("%s",e),e.type){case"{":this.skipSpaces();var s=this.expression();this.skipSpaces(),this.expect("}"),t.push(s);break;case this.prefix&&".":var i=new nodes.Literal(e.val+this.prefix);i.prefixed=!0,t.push(i);break;case"comment":break;case"color":case"unit":t.push(new nodes.Literal(e.val.raw));break;case"space":t.push(new nodes.Literal(" "));break;case"function":t.push(new nodes.Literal(e.val.name+"("));break;case"ident":t.push(new nodes.Literal(e.val.name||e.val.string));break;default:t.push(new nodes.Literal(e.val)),e.space&&t.push(new nodes.Literal(" "))}return t},assignment:function(){var e,t,s=this.id().name;if(e=this.accept("=")||this.accept("?=")||this.accept("+=")||this.accept("-=")||this.accept("*=")||this.accept("/=")||this.accept("%=")){this.state.push("assignment");var i=this.list();switch(i.isEmpty&&this.assignAtblock(i),t=new nodes.Ident(s,i),this.state.pop(),e.type){case"?=":var n=new nodes.BinOp("is defined",t),a=new nodes.Expression;a.push(new nodes.Ident(s)),t=new nodes.Ternary(n,a,t);break;case"+=":case"-=":case"*=":case"/=":case"%=":t.val=new nodes.BinOp(e.type[0],new nodes.Ident(s),i)}}return t},function:function(){var e,t=1,s=2;e:for(;e=this.lookahead(s++);)switch(e.type){case"function":case"(":++t;break;case")":if(!--t)break e;break;case"eos":this.error('failed to find closing paren ")"')}switch(this.currentState()){case"expression":return this.functionCall();default:return this.looksLikeFunctionDefinition(s)?this.functionDefinition():this.expression()}},url:function(){this.expect("function"),this.state.push("function arguments");var e=this.args();return this.expect(")"),this.state.pop(),new nodes.Call("url",e)},functionCall:function(){var e=this.accept("+");if("url"==this.peek().val.name)return this.url();var t=this.expect("function").val.name;this.state.push("function arguments"),this.parens++;var s=this.args();this.expect(")"),this.parens--,this.state.pop();var i=new nodes.Call(t,s);return e&&(this.state.push("function"),i.block=this.block(i),this.state.pop()),i},functionDefinition:function(){var e=this.expect("function").val.name;this.state.push("function params"),this.skipWhitespace();var t=this.params();this.skipWhitespace(),this.expect(")"),this.state.pop(),this.state.push("function");var s=new nodes.Function(e,t);return s.block=this.block(s),this.state.pop(),new nodes.Ident(e,s)},params:function(){for(var e,t,s=new nodes.Params;e=this.accept("ident");)this.accept("space"),s.push(t=e.val),this.accept("...")?t.rest=!0:this.accept("=")&&(t.val=this.expression()),this.skipWhitespace(),this.accept(","),this.skipWhitespace();return s},args:function(){var e,t=new nodes.Arguments;do{"ident"==this.peek().type&&":"==this.lookahead(2).type?(e=this.next().val.string,this.expect(":"),t.map[e]=this.expression()):t.push(this.expression())}while(this.accept(","));return t},list:function(){for(var e=this.expression();this.accept(",");)if(e.isList)t.push(this.expression());else{var t=new nodes.Expression(!0);t.push(e),t.push(this.expression()),e=t}return e},expression:function(){var e,t=new nodes.Expression;for(this.state.push("expression");e=this.negation();)e||this.error("unexpected token {peek} in expression"),t.push(e);return this.state.pop(),t.nodes.length&&(t.lineno=t.nodes[0].lineno,t.column=t.nodes[0].column),t},negation:function(){return this.accept("not")?new nodes.UnaryOp("!",this.negation()):this.ternary()},ternary:function(){var e=this.logical();if(this.accept("?")){var t=this.expression();this.expect(":");var s=this.expression();e=new nodes.Ternary(e,t,s)}return e},logical:function(){for(var e,t=this.typecheck();e=this.accept("&&")||this.accept("||");)t=new nodes.BinOp(e.type,t,this.typecheck());return t},typecheck:function(){for(var e,t=this.equality();e=this.accept("is a");)this.operand=!0,t||this.error('illegal unary "'+e+'", missing left-hand operand'),t=new nodes.BinOp(e.type,t,this.equality()),this.operand=!1;return t},equality:function(){for(var e,t=this.in();e=this.accept("==")||this.accept("!=");)this.operand=!0,t||this.error('illegal unary "'+e+'", missing left-hand operand'),t=new nodes.BinOp(e.type,t,this.in()),this.operand=!1;return t},in:function(){for(var e=this.relational();this.accept("in");)this.operand=!0,e||this.error('illegal unary "in", missing left-hand operand'),e=new nodes.BinOp("in",e,this.relational()),this.operand=!1;return e},relational:function(){for(var e,t=this.range();e=this.accept(">=")||this.accept("<=")||this.accept("<")||this.accept(">");)this.operand=!0,t||this.error('illegal unary "'+e+'", missing left-hand operand'),t=new nodes.BinOp(e.type,t,this.range()),this.operand=!1;return t},range:function(){var e,t=this.additive();return(e=this.accept("...")||this.accept(".."))&&(this.operand=!0,t||this.error('illegal unary "'+e+'", missing left-hand operand'),t=new nodes.BinOp(e.val,t,this.additive()),this.operand=!1),t},additive:function(){for(var e,t=this.multiplicative();e=this.accept("+")||this.accept("-");)this.operand=!0,t=new nodes.BinOp(e.type,t,this.multiplicative()),this.operand=!1;return t},multiplicative:function(){for(var e,t=this.defined();e=this.accept("**")||this.accept("*")||this.accept("/")||this.accept("%");){if(this.operand=!0,"/"==e&&this.inProperty&&!this.parens)return this.stash.push(new Token("literal",new nodes.Literal("/"))),this.operand=!1,t;t||this.error('illegal unary "'+e+'", missing left-hand operand'),t=new nodes.BinOp(e.type,t,this.defined()),this.operand=!1}return t},defined:function(){var e=this.unary();return this.accept("is defined")&&(e||this.error('illegal unary "is defined", missing left-hand operand'),e=new nodes.BinOp("is defined",e)),e},unary:function(){var e,t;return(e=this.accept("!")||this.accept("~")||this.accept("+")||this.accept("-"))?(this.operand=!0,t=this.unary(),t||this.error('illegal unary "'+e+'"'),t=new nodes.UnaryOp(e.type,t),this.operand=!1,t):this.subscript()},subscript:function(){for(var e=this.member();this.accept("[");)e=new nodes.BinOp("[]",e,this.expression()),this.expect("]");return this.accept("=")&&(e.op+="=",e.val=this.list(),e.val.isEmpty&&this.assignAtblock(e.val)),e},member:function(){var e=this.primary();if(e){for(;this.accept(".");){var t=new nodes.Ident(this.expect("ident").val.string);e=new nodes.Member(e,t)}this.skipSpaces(),this.accept("=")&&(e.val=this.list(),e.val.isEmpty&&this.assignAtblock(e.val))}return e},object:function(){var e,t,s,i=new nodes.Object;for(this.expect("{"),this.skipWhitespace();!this.accept("}");)this.accept("comment")||this.accept("newline")||(s||this.accept(","),e=this.accept("ident")||this.accept("string"),e||this.error('expected "ident" or "string", got {peek}'),e=e.val.hash,this.skipSpacesAndComments(),this.expect(":"),t=this.expression(),i.set(e,t),s=this.accept(","),this.skipWhitespace());return i},primary:function(){var e;if(this.skipSpaces(),this.accept("(")){++this.parens;var t=this.expression(),s=this.expect(")");return--this.parens,this.accept("%")&&t.push(new nodes.Ident("%")),e=this.peek(),!s.space&&"ident"==e.type&&~units.indexOf(e.val.string)&&(t.push(new nodes.Ident(e.val.string)),this.next()),t}switch(e=this.peek(),e.type){case"null":case"unit":case"color":case"string":case"literal":case"boolean":case"comment":return this.next().val;case!this.cond&&"{":return this.object();case"atblock":return this.atblock();case"atrule":var i=new nodes.Ident(this.next().val);return i.property=!0,i;case"ident":return this.ident();case"function":return e.anonymous?this.functionDefinition():this.functionCall()}}};