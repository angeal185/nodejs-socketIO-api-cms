var utils=require("../utils"),nodes=require("../nodes"),componentMap={red:"r",green:"g",blue:"b",alpha:"a",hue:"h",saturation:"s",lightness:"l"},unitMap={hue:"deg",saturation:"%",lightness:"%"},typeMap={red:"rgba",blue:"rgba",green:"rgba",alpha:"rgba",hue:"hsla",saturation:"hsla",lightness:"hsla"};module.exports=function(e,r){utils.assertColor(e,"color"),utils.assertString(r,"name");var r=r.string,a=unitMap[r],n=typeMap[r],r=componentMap[r];if(!r)throw new Error('invalid color component "'+r+'"');return new nodes.Unit(e[n][r],a)};
