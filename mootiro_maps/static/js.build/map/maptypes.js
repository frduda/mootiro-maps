(function(){var e=Object.prototype.hasOwnProperty,t=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t};define(["require","googlemaps","./component"],function(e){var n,r,i,s;return i=e("googlemaps"),r=e("./component"),window.komoo==null&&(window.komoo={}),(s=window.komoo).event==null&&(s.event=i.event),n=function(e){function n(){this.mapType=new i.StyledMapType([{featureType:"poi",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"all",stylers:[{lightness:70}]},{featureType:"transit",elementType:"all",stylers:[{lightness:50}]},{featureType:"water",elementType:"all",stylers:[{lightness:50}]},{featureType:"administrative",elementType:"labels",stylers:[{lightness:30}]}],{name:gettext("Clean")})}return t(n,e),n.prototype.id="clean",n.prototype.setMap=function(e){var t;return this.map=e,this.map.googleMap.mapTypes.set(this.id,this.mapType),t=this.map.googleMap.mapTypeControlOptions,t.mapTypeIds.push(this.id),this.map.googleMap.setOptions({mapTypeControlOptions:t}),this.map.publish("maptype_loaded",this.id)},n}(r),window.komoo.maptypes={CleanMapType:n},window.komoo.maptypes})}).call(this);