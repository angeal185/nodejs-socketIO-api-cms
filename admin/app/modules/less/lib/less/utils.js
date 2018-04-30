module.exports={getLocation:function(n,e){for(var t=n+1,o=null,l=-1;--t>=0&&"\n"!==e.charAt(t);)l++;return"number"==typeof n&&(o=(e.slice(0,n).match(/\n/g)||"").length),{line:o,column:l}}};
