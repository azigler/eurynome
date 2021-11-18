"use strict";function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,n){if(e){if("string"==typeof e)return _arrayLikeToArray(e,n);var o=Object.prototype.toString.call(e).slice(8,-1);return"Object"===o&&e.constructor&&(o=e.constructor.name),"Map"===o||"Set"===o?Array.from(e):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?_arrayLikeToArray(e,n):void 0}}function _iterableToArray(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _arrayLikeToArray(e,n){(null==n||n>e.length)&&(n=e.length);for(var o=0,t=new Array(n);o<n;o++)t[o]=e[o];return t}function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,n){for(var o=0;o<n.length;o++){var t=n[o];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}function _createClass(e,n,o){return n&&_defineProperties(e.prototype,n),o&&_defineProperties(e,o),e}var m=require("mithril"),io=require("socket.io-client");module.exports=function(){function e(){var n=this;_classCallCheck(this,e),this.id="AppWebSocket",window.io=io((process.env.DEVELOPMENT,"http://localhost:6177")),this.log("Attempting connection to server..."),m.route.set("/splash"),window.io.on("connect",function(){n.log("Connected to server!"),window.$eu.stream.connection(!0)}),window.io.on("reconnecting",function(){n.log("Attempting reconnection to server!")}),window.io.on("disconnect",function(){window.$eu.stream.connection(!1),"/splash"!==m.route.get()&&n.resetLog(),n.log("Disconnected from server!"),m.route.set("/splash")}),window.io.on("duplicate-socket",function(){n.log("This client was already connected! Closing that connection...")}),window.io.on("eurynome-handshake",function(){var e=window.$eu.store.get("uuid");e?(window.io.emit("eurynome-handshake",e),n.log("Handshaking with client uuid:\n".concat(e))):(window.io.emit("initialize-new-client"),n.log("Requesting new client uuid..."))}),window.io.on("new-client-initialized",function(e){window.$eu.stream.connection(e),window.$eu.store.set("uuid",e.uuid),n.log("Assigned new client uuid:\n".concat(e.uuid)),n.log("You can now enter...")}),window.io.on("handshake-recognized",function(e){window.$eu.stream.connection(e),n.log("Recognized with client uuid:\n".concat(e.uuid)),n.log("You can now enter...")}),window.io.on("pong",function(e){window.$eu.stream.latency(e),m.redraw()}),window.io.on("connected-clients",function(e){window.$eu.stream.connectedClients(e.clients),m.redraw()}),window.io.on("connected-characters",function(e){window.$eu.stream.connectedCharacters(e.characters),m.redraw()}),window.io.on("available",function(e){window.$eu.stream.availableCharacters(e.characters),window.$eu.stream.availableWorlds(e.worlds),m.redraw()})}return _createClass(e,[{key:"log",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"connection";console.log(e);var o=window.$eu.stream["".concat(n,"Log")];o([].concat(_toConsumableArray(o()),[e])),m.redraw()}},{key:"resetLog",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"connection";console.log("Resetting ".concat(e," log!")),window.$eu.stream["".concat(e,"Log")]([]),m.redraw()}},{key:"view",value:function(){}}]),e}();