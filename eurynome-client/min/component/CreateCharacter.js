"use strict";function _toConsumableArray(r){return _arrayWithoutHoles(r)||_iterableToArray(r)||_unsupportedIterableToArray(r)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(r,e){if(r){if("string"==typeof r)return _arrayLikeToArray(r,e);var t=Object.prototype.toString.call(r).slice(8,-1);return"Object"===t&&r.constructor&&(t=r.constructor.name),"Map"===t||"Set"===t?Array.from(r):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?_arrayLikeToArray(r,e):void 0}}function _iterableToArray(r){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(r))return Array.from(r)}function _arrayWithoutHoles(r){if(Array.isArray(r))return _arrayLikeToArray(r)}function _arrayLikeToArray(r,e){(null==e||e>r.length)&&(e=r.length);for(var t=0,o=new Array(e);t<e;t++)o[t]=r[t];return o}function _classCallCheck(r,e){if(!(r instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(r,e){for(var t=0;t<e.length;t++){var o=e[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(r,o.key,o)}}function _createClass(r,e,t){return e&&_defineProperties(r.prototype,e),t&&_defineProperties(r,t),r}var m=require("mithril"),ButtonBack=require("./ButtonBack"),_require=require("construct-ui"),Form=_require.Form,Card=_require.Card,FormGroup=_require.FormGroup,Input=_require.Input,FormLabel=_require.FormLabel,Button=_require.Button,Tag=_require.Tag;module.exports=function(){function r(){var e=this;_classCallCheck(this,r),this.id="CreateCharacter",this.errorSfx=window.$eu.sfx.get("error"),window.io.once("new-character-initialized",function(r){window.$eu.store.set("characters",[].concat(_toConsumableArray(window.$eu.store.get("characters")),[r])),m.route.set("/world?world=".concat(r.world,"&char=").concat(r.name))}),window.io.on("character-name-taken",function(){e.error="name is taken",e.errorSfx.play(),m.redraw()})}return _createClass(r,[{key:"onremove",value:function(){window.io.off("new-character-initialized"),window.io.off("character-name-taken")}},{key:"view",value:function(){var r=this;this.world=m.route.param("world");var e=window.$eu.sfx.get("button");return m("div",{id:this.id},m("link",{href:"./min/css/".concat(this.id,".css"),rel:"stylesheet"}),m("h3",null,"create a character"),m(Card,null,m(Form,{onsubmit:function(r){r.preventDefault()}},m(FormGroup,null,m(FormLabel,{for:"name"},"name"),m(Input,{id:"name",name:"name",intent:this.error?"error":"",placeholder:"...",maxlength:"15",oninput:function(e){r.name=e.target.value}})),m(FormGroup,null,m(FormLabel,{for:"world"},"world"),m(Tag,{label:this.world})),m(FormGroup,{class:"error"},m("div",{class:"error-message"},this.error)),m(FormGroup,{class:"button-holder"},m(ButtonBack,{route:"/select-character?world=".concat(this.world)}),m(Button,{type:"submit",label:"submit",intent:"positive",onclick:function(){if(r.name.length<3)return r.error="name is too short",r.errorSfx.play(),void m.redraw();window.io.emit("create-new-character",{name:r.name,world:r.world}),e.play()}})))))}}]),r}();