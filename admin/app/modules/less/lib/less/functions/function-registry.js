function makeRegistry(t){return{_data:{},add:function(t,e){t=t.toLowerCase(),this._data.hasOwnProperty(t),this._data[t]=e},addMultiple:function(t){Object.keys(t).forEach(function(e){this.add(e,t[e])}.bind(this))},get:function(e){return this._data[e]||t&&t.get(e)},inherit:function(){return makeRegistry(this)}}}module.exports=makeRegistry(null);
