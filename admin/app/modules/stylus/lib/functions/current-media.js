var nodes=require("../nodes");module.exports=function(){function e(o){return"media"==o.nodeName?(o.val=n.visit(o.val),o.toString()):o.block.parent.node?e(o.block.parent.node):void 0}var n=this;return new nodes.String(e(this.closestBlock.node)||"")};
