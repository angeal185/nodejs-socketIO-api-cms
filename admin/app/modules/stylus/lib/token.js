var inspect=require("util").inspect,Token=exports=module.exports=function(t,i){this.type=t,this.val=i};Token.prototype.inspect=function(){var t=" "+inspect(this.val);return"[Token:"+this.lineno+":"+this.column+" [32m"+this.type+"[0m[33m"+(this.val?t:"")+"[0m]"},Token.prototype.toString=function(){return(void 0===this.val?this.type:this.val).toString()};