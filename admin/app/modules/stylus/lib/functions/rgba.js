var utils=require("../utils"),nodes=require("../nodes");module.exports=function(e,t,a,r){switch(arguments.length){case 1:return utils.assertColor(e),e.rgba;case 2:utils.assertColor(e);var s=e.rgba;return utils.assertType(t,"unit","alpha"),r=t.clone(),"%"==r.type&&(r.val/=100),new nodes.RGBA(s.r,s.g,s.b,r.val);default:utils.assertType(e,"unit","red"),utils.assertType(t,"unit","green"),utils.assertType(a,"unit","blue"),utils.assertType(r,"unit","alpha");var l="%"==e.type?Math.round(2.55*e.val):e.val,u="%"==t.type?Math.round(2.55*t.val):t.val,n="%"==a.type?Math.round(2.55*a.val):a.val;return r=r.clone(),r&&"%"==r.type&&(r.val/=100),new nodes.RGBA(l,u,n,r.val)}};
