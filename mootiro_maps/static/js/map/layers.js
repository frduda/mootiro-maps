// Generated by CoffeeScript 1.4.0
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  'use strict';

  var Layer, Layers, and_ops, collections, contains_ops, equal_ops, eval_expr, in_ops, layers, not_equal_ops, not_ops, or_ops, static_path;
  collections = require('./collections');
  static_path = '/static/';
  equal_ops = ['==', 'is', 'equal', 'equals'];
  not_equal_ops = ['!=', 'isnt', 'not equal', 'not equals', 'different'];
  in_ops = ['in'];
  contains_ops = ['contains', 'has'];
  not_ops = ['!', 'not'];
  or_ops = ['or'];
  and_ops = ['and'];
  eval_expr = function(expr, obj) {
    var operator, res, v, _i, _len, _ref, _ref1, _ref2;
    if (!(expr != null) || !(expr.operator != null)) {
      return true;
    }
    if (!(obj != null)) {
      return false;
    }
    operator = expr.operator;
    if (__indexOf.call(equal_ops, operator) >= 0) {
      return obj.getProperty(expr.property) === expr.value;
    } else if (__indexOf.call(not_equal_ops, operator) >= 0) {
      return !obj.getProperty(expr.property) === expr.value;
    } else if (__indexOf.call(in_ops, operator) >= 0) {
      return _ref = obj.getProperty(expr.property), __indexOf.call(expr.value, _ref) >= 0;
    } else if (__indexOf.call(contains_ops, operator) >= 0 && Object.prototype.toString.call(expr.value) === '[object Array]') {
      res = true;
      _ref1 = expr.value;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        v = _ref1[_i];
        res = res && __indexOf.call(obj.getProperty(expr.property), v) >= 0;
      }
      return res;
    } else if (__indexOf.call(contains_ops, operator) >= 0) {
      return _ref2 = expr.value, __indexOf.call(obj.getProperty(expr.property), _ref2) >= 0;
    } else if (__indexOf.call(not_ops, operator) >= 0) {
      return !eval_expr(expr.child, obj);
    } else if (__indexOf.call(or_ops, operator) >= 0) {
      return eval_expr(expr.left, obj) || eval_expr(expr.right, obj);
    } else if (__indexOf.call(and_ops, operator) >= 0) {
      return eval_expr(expr.left, obj) && eval_expr(expr.right, obj);
    }
  };
  window.ee = eval_expr;
  Layers = (function(_super) {

    __extends(Layers, _super);

    function Layers() {
      return Layers.__super__.constructor.apply(this, arguments);
    }

    Layers.prototype.addLayer = function(layer) {
      var _ref;
      if (!this.contains(layer)) {
        this.push(layer);
      }
      return (_ref = layer.map) != null ? _ref.publish('layer_added', layer) : void 0;
    };

    Layers.prototype.getLayer = function(id) {
      var layers;
      layers = this.filter(function(layer) {
        return layer.getId() === id || layer.getName() === id;
      });
      return layers.first;
    };

    Layers.prototype.showLayer = function(name) {
      return this.getLayer(name).show();
    };

    Layers.prototype.hideLayer = function(name) {
      return this.getLayer(name).hide();
    };

    Layers.prototype.showAll = function() {
      return this.forEach(function(layer) {
        return layer.show();
      });
    };

    Layers.prototype.hideAll = function() {
      return this.forEach(function(layer) {
        return layer.hide();
      });
    };

    Layers.prototype.getVisibleLayers = function() {
      return this.filter(function(layer) {
        return layer.visible;
      });
    };

    Layers.prototype.getHiddenLayers = function() {
      return this.filter(function(layer) {
        return !layer.visible;
      });
    };

    Layers.prototype.shouldFeatureBeVisible = function(feature) {
      var notOrphan, orphan, visible;
      if (this.length === 0) {
        return true;
      }
      visible = false;
      this.getVisibleLayers().forEach(function(layer) {
        return visible || (visible = layer.match(feature));
      });
      orphan = !visible;
      if (orphan) {
        notOrphan = false;
        this.getHiddenLayers().forEach(function(layer) {
          return notOrphan || (notOrphan = layer.match(feature));
        });
        orphan = !notOrphan;
      }
      return visible || orphan;
    };

    Layers.prototype.setCollection = function(collection) {
      this.collection = collection;
    };

    Layers.prototype.getCollection = function() {
      var _ref, _ref1, _ref2;
      return (_ref = (_ref1 = this.collection) != null ? _ref1 : (_ref2 = this.map) != null ? _ref2.getFeatures() : void 0) != null ? _ref : [];
    };

    Layers.prototype.loadLayer = function(data) {
      var layer;
      layer = new Layer(_.extend({
        collection: this.getCollection(),
        map: this.map
      }, data));
      this.addLayer(layer);
      return layer;
    };

    Layers.prototype.loadLayers = function(data) {
      var layers,
        _this = this;
      layers = [];
      data.forEach(function(l) {
        return layers.push(_this.loadLayer(l));
      });
      return layers;
    };

    Layers.prototype.setMap = function(map) {
      this.map = map;
      if (!this.map) {
        return;
      }
      return this.forEach(function(layer) {
        return layer.setMap(this.map);
      });
    };

    Layers.prototype.toJSON = function() {
      var layers;
      layers = [];
      this.forEach(function(layer) {
        return layers.push(layer.toJSON());
      });
      return layers;
    };

    return Layers;

  })(collections.GenericCollection);
  Layer = (function() {

    function Layer(options) {
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      this.options = options != null ? options : {};
      this.cache = new collections.FeatureCollection();
      this.visible = (_ref = this.options.visible) != null ? _ref : true;
      this.icon = (_ref1 = (_ref2 = this.options.icon) != null ? _ref2[0] : void 0) != null ? _ref1 : '';
      this.iconOff = (_ref3 = (_ref4 = this.options.icon) != null ? _ref4[1] : void 0) != null ? _ref3 : '';
      this.fillColor = (_ref5 = (_ref6 = this.options.color) != null ? _ref6[0] : void 0) != null ? _ref5 : '';
      this.strokeColor = (_ref7 = (_ref8 = this.options.color) != null ? _ref8[1] : void 0) != null ? _ref7 : this.fillColor;
      this.id = '' + ((_ref9 = this.options.id) != null ? _ref9 : this.options.name);
      this.setPosition(this.options.position);
      this.setName(this.options.name);
      this.setRule(this.options.rule);
      this.setCollection(this.options.collection);
      this.setMap(this.options.map);
    }

    Layer.prototype.getPosition = function() {
      return this.position;
    };

    Layer.prototype.setPosition = function(position) {
      this.position = position;
      return this;
    };

    Layer.prototype.getId = function() {
      return this.id;
    };

    Layer.prototype.getName = function() {
      return this.name;
    };

    Layer.prototype.setName = function(name) {
      this.name = name;
      return this;
    };

    Layer.prototype.getFillColor = function() {
      return this.fillColor;
    };

    Layer.prototype.setFillColor = function(fillColor) {
      this.fillColor = fillColor;
      return this;
    };

    Layer.prototype.getStrokeColor = function() {
      return this.strokeColor;
    };

    Layer.prototype.setStrokeColor = function(strokeColor) {
      this.strokeColor = strokeColor;
      return this;
    };

    Layer.prototype.getCollection = function() {
      return this.collection;
    };

    Layer.prototype.setCollection = function(collection) {
      this.collection = collection;
      this.cache.clear();
      return this;
    };

    Layer.prototype.getRule = function() {
      return this.rule;
    };

    Layer.prototype.setRule = function(rule) {
      this.rule = rule;
      this.cache.clear();
      return this;
    };

    Layer.prototype.getIconUrl = function() {
      return static_path + (this.visible ? this.icon : this.iconOff);
    };

    Layer.prototype.setMap = function(map) {
      var _base;
      this.map = map;
      if (!this.map) {
        return;
      }
      this.handleMapEvents();
      if (typeof (_base = this.cache).setMap === "function") {
        _base.setMap(this.map);
      }
      if (!(this.collection != null)) {
        return this.setCollection(this.map.getFeatures());
      }
    };

    Layer.prototype.handleMapEvents = function() {
      var _this = this;
      return this.map.subscribe('feature_added', function(feature) {
        if (!_this.cache.isEmpty() && _this.match(feature)) {
          return _this.cache.push(feature);
        }
      });
    };

    Layer.prototype.show = function() {
      this.visible = true;
      return this.getFeatures().show();
    };

    Layer.prototype.hide = function() {
      this.visible = false;
      return this.getFeatures().hide();
    };

    Layer.prototype.toggle = function() {
      if (!this.visible) {
        this.show();
      } else {
        this.hide();
      }
      return this.visible;
    };

    Layer.prototype.match = function(feature) {
      return eval_expr(this.rule, feature);
    };

    Layer.prototype.getFeatures = function() {
      if (this.cache.isEmpty()) {
        this.updateCache();
      }
      return this.cache;
    };

    Layer.prototype.countFeatures = function() {
      return this.getFeatures().length;
    };

    Layer.prototype.updateCache = function() {
      var filtered,
        _this = this;
      this.cache.clear();
      filtered = this.collection.filter(this.match, this);
      filtered.forEach(function(feature) {
        return _this.cache.push(feature);
      });
      return this;
    };

    Layer.prototype.toJSON = function() {
      return {
        "id": this.getId(),
        "name": this.getName(),
        "rule": this.getRule(),
        "position": this.getPosition(),
        "fillColor": this.getFillColor(),
        "strokeColor": this.getStrokeColor()
      };
    };

    return Layer;

  })();
  layers = {
    Layers: Layers,
    Layer: Layer
  };
  return layers;
});
