define(["map/layers"],function(e){var t=function(t){t===undefined&&(t="<div>"),this.$el=$(t),this.$el.addClass("layers_widget"),this.layers=new e.Layers,window.layers=this.layers,this.createControls()};return t.prototype.createControls=function(){var e=this;this.cur=0,this.$ul=$("<ul>"),this.$ul.sortable({placeholder:"ui-state-highlight",forcePlaceholderSize:!0,delay:300,axis:"y",stop:function(t,n){e.refresh()}}).disableSelection(),this.$el.append(this.$ul);var t=$("<a>").text(gettext("New layer")).addClass("add_btn");t.click(function(){e.createNewLayer()}),this.$el.append(t)},t.prototype.refresh=function(e){e=e||this.layers,e.forEach(function(e){e.$el.find("input[name=name]").val(e.getName());var t=e.getRule();t!==undefined&&t.operator==="has"&&t.property==="tags"&&t.value!==undefined&&e.$el.find("input[name=tags]").importTags(t.value.join(",")),e.$el.find(".fillcolor").colpickSetColor(e.getFillColor()),e.$el.find(".fillcolor").css("background",e.getFillColor()),e.$el.find(".strokecolor").colpickSetColor(e.getStrokeColor()),e.$el.find(".strokecolor").css("background",e.getStrokeColor()),e.setPosition(e.$el.index()),e.$el.find(".title").text(interpolate(gettext("Layer %s"),[e.getPosition()+1])),e.$el.find(".layer_name").text(e.getName())})},t.prototype.setRule=function(e,t){var n=undefined;t.length&&(n={operator:"has",property:"tags",value:t.split(",")}),e.setRule(n);var r=e.countFeatures();e.$el.find(".layer_count").text(interpolate(ngettext("%s object","%s objects",r),[r]))},t.prototype.addNewLayer=function(e,t){var n=this;this.$ul.find(".content").slideUp().parent().find(".details").show(),e.$el=$("<li>").addClass("layer"),e.$el.html('<div class="header"><h3 class="title"></h3><div class="details"><strong class="layer_name"></strong></div><span class="layer_count"></span></div>'),e.$el.find(".details").hide(),e.$el.append($("#layer_content_model").clone().show().attr("id","")),this.$ul.append(e.$el),e.$el.find("input[name=name]").change(function(){e.setName(this.value),e.$el.find(".layer_name").text(this.value)}),e.$el.find("input[name=tags]").attr("id","tags"+e.getId()).tagsInput({autocomplete_url:"/project/search_all_tags/",height:"auto",width:"100%",onChange:function(){var t=n.setRule(e,$(this).val())}}),e.$el.find(".fillcolor").colpick({layout:"hex",submit:0,colorScheme:"light",onChange:function(t,n,r,i){i||(e.$el.find(".fillcolor").css("background","#"+n),e.setFillColor("#"+n))}}).keyup(function(){$(this).colpickSetColor(this.value)}),e.$el.find(".strokecolor").colpick({layout:"hex",submit:0,colorScheme:"light",onChange:function(t,n,r,i){i||(e.$el.find(".strokecolor").css("background","#"+n),e.setStrokeColor("#"+n))}}).keyup(function(){$(this).colpickSetColor(this.value)}),e.$el.data("layer",e),e.$el.find(".header").click(function(){n.toggleLayer(e)}),e.$el.find(".delete").click(function(){confirmationMessage(gettext("Remove layer"),gettext("Do you really want to remove this layer?"),null,function(t){t==="yes"&&n.removeLayer(e)})}),e.$el.find(".collapse_btn").click(function(){n.toggleLayer(e)}),this.layers.addLayer(e),e.setMap(t),this.refresh([e])},t.prototype.toggleLayer=function(e){e.$el.find(".content").toggle(500),e.$el.find(".details").toggle()},t.prototype.removeLayer=function(e){e.delete=!0,e.isNew&&this.layers.remove(e),e.$el.remove(),this.refresh()},t.prototype.createNewLayer=function(t){var n=new e.Layer({id:"new"+this.cur++});n.isNew=!0,this.addNewLayer(n,t),n.$el.find("input[name=name]").focus()},t.prototype.loadLayers=function(e,t){for(var n=0,r=e.length;n<r;n++)this.addNewLayer(e[n],t)},t.prototype.toJSON=function(){return layers=[],this.layers.forEach(function(e){var t=e.toJSON();e.isNew&&(t.id=undefined),e.delete&&(t.delete=!0),layers.push(t)}),layers},t});