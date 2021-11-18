"use strict";function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach(function(r){_defineProperty(e,r,t[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})}return e}function _defineProperty(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),e}var m=require("mithril"),WorldSidebar=require("./WorldSidebar"),WorldDebugMain=require("./WorldDebug/Main");module.exports=function(){function e(){var r=this;_classCallCheck(this,e),this.id="RouteWorld",this.world=m.route.param("world"),this.character=m.route.param("char"),this.worldMain="",window.io.on("world-state",function(e){r.state=_objectSpread(_objectSpread({},e.state),{},{character:r.character,world:r.world}),m.redraw()}),window.io.emit("enter-world",{character:this.character,world:this.world})}return _createClass(e,[{key:"onremove",value:function(){window.io.off("world-state")}},{key:"view",value:function(){switch(this.world){case"debug":this.worldMain=WorldDebugMain}return m("div",{id:this.id},m(WorldSidebar,{state:this.state}),m(this.worldMain,{state:this.state}))}}]),e}();