var getCache=module.exports=function(e,r){if("function"==typeof e)return new e(r);var n;switch(e){case"memory":n=require("./memory");break;default:n=require("./null")}return new n(r)};
