(function(){var e=Array.prototype.indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(t in this&&this[t]===e)return t;return-1},t=Object.prototype.hasOwnProperty,n=function(e,n){function i(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return i.prototype=n.prototype,e.prototype=new i,e.__super__=n.prototype,e};define(["require","./collections"],function(t){var r,i,s,o,u;return s=t("./collections"),o=function(t,n){var r,i,s,u,a,f,l,c;if(t==null||n==null)return!1;r=t.operator;if(r==="=="||r==="is"||r==="equal"||r==="equals")return n.getProperty(t.property)===t.value;if(r==="!="||r==="isnt"||r==="not equal"||r==="not equals"||r==="different")return!n.getProperty(t.property)===t.value;if(r==="in")return f=n.getProperty(t.property),e.call(t.value,f)>=0;if((r==="contains"||r==="has")&&Object.prototype.toString.call(t.value)==="[object Array]"){i=!0,l=t.value;for(u=0,a=l.length;u<a;u++)s=l[u],i=i&&e.call(n.getProperty(t.property),s)>=0;return i}if(r==="contains"||r==="has")return c=t.value,e.call(n.getProperty(t.property),c)>=0;if(r==="!"||r==="not")return!o(t.child,n);if(r==="or")return o(t.left,n)||o(t.right,n);if(r==="and")return o(t.left,n)&&o(t.right,n)},window.ee=o,i=function(e){function t(){t.__super__.constructor.apply(this,arguments)}return n(t,e),t.prototype.addLayer=function(e){var t;return this.getLayer(e.getName())||this.push(e),(t=e.map)!=null?t.publish("layer_added",e):void 0},t.prototype.getLayer=function(e){var t;return t=this.filter(function(t){return t.getId()===e||t.getName()===e}),t.first},t.prototype.showLayer=function(e){return this.getLayer(e).show()},t.prototype.hideLayer=function(e){return this.getLayer(e).hide()},t.prototype.showAll=function(){return this.forEach(function(e){return e.show()})},t.prototype.hideAll=function(){return this.forEach(function(e){return e.hide()})},t.prototype.getVisibleLayers=function(){return this.filter(function(e){return e.visible})},t.prototype.getHiddenLayers=function(){return this.filter(function(e){return!e.visible})},t.prototype.shouldFeatureBeVisible=function(e){var t;return t=!1,this.getVisibleLayers().forEach(function(n){return t||(t=n.match(e))}),t},t}(s.GenericCollection),r=function(){function e(e){var t,n,r,i,o,u;this.options=e!=null?e:{},this.cache=new s.FeatureCollection,this.visible=(t=this.options.visible)!=null?t:!0,this.icon=(n=(r=this.options.icon)!=null?r[0]:void 0)!=null?n:"",this.iconOff=(i=(o=this.options.icon)!=null?o[1]:void 0)!=null?i:"",this.id=(u=this.options.id)!=null?u:this.options.name,this.setPosition(this.options.position),this.setName(this.options.name),this.setRule(this.options.rule),this.setMap(this.options.map),this.setCollection(this.options.collection)}return e.prototype.getPosition=function(){return this.position},e.prototype.setPosition=function(e){return this.position=e,this},e.prototype.getId=function(){return this.id},e.prototype.getName=function(){return this.name},e.prototype.setName=function(e){return this.name=e,this},e.prototype.getCollection=function(){return this.collection},e.prototype.setCollection=function(e){return this.collection=e,this.cache.clear(),this},e.prototype.getRule=function(){return this.rule},e.prototype.setRule=function(e){return this.rule=e,this.cache.clear(),this},e.prototype.getIconUrl=function(){return"/static/"+(this.visible?this.icon:this.iconOff)},e.prototype.setMap=function(e){var t;return this.map=e,this.handleMapEvents(),typeof (t=this.cache).setMap=="function"?t.setMap(this.map):void 0},e.prototype.handleMapEvents=function(){var e=this;return this.map.subscribe("feature_added",function(t){if(!e.cache.isEmpty()&&e.match(t))return e.cache.push(t)})},e.prototype.show=function(){return this.visible=!0,this.getFeatures().show()},e.prototype.hide=function(){return this.visible=!1,this.getFeatures().hide()},e.prototype.toggle=function(){return this.visible?this.hide():this.show(),this.visible},e.prototype.match=function(e){return o(this.rule,e)},e.prototype.getFeatures=function(){return this.cache.isEmpty()&&this.updateCache(),this.cache},e.prototype.updateCache=function(){var e,t=this;return this.cache.clear(),e=this.collection.filter(this.match,this),e.forEach(function(e){return t.cache.push(e)}),this},e}(),u={Layers:i,Layer:r},u})}).call(this);