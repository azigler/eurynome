"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),e}var m=require("mithril"),GridCard=require("./GridCard"),ButtonBack=require("./ButtonBack"),_require=require("construct-ui"),Button=_require.Button;module.exports=function(){function e(){_classCallCheck(this,e),this.id="SelectWorld"}return _createClass(e,[{key:"view",value:function(){var e=window.$eu.stream.availableWorlds(),r=window.$eu.sfx.get("button");return 1===e.length&&m.route.set("/select-character?world=".concat(e[0])),0===e.length?m("div",{id:this.id,class:"eu-select"},m(GridCard,null,m("div",null,m("span",null,"No worlds are available."))),m(ButtonBack,{route:"/splash"})):m("div",{id:this.id,class:"eu-select"},m("h3",null,"select a world"),m(GridCard,null,e.map(function(e,t){return m("a",{href:"#!/select-character?world=".concat(e),key:t,onclick:function(){r.play()}},m("span",{class:"option"},e))})),m(ButtonBack,{route:"/splash"}))}}]),e}();