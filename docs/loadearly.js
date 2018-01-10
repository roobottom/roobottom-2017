/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var hasClass = function(ele,cls) {
  return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
};
module.exports.hasClass = hasClass;

var addClass = function(ele,cls) {
	if (!hasClass(ele,cls)) {
    var classNames = ele.className.split(/\s+/);
    classNames.push(cls);
    ele.className = classNames.join(' ');
  }
};
module.exports.addClass = addClass;

var removeClass = function(ele,cls) {
	if (hasClass(ele,cls)) {
		var regex = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className=ele.className.replace(regex,' ');
	}
};
module.exports.removeClass = removeClass;

module.exports.toggleClass = function(ele,cls) {
  if (!hasClass(ele,cls)) {
    addClass(ele,cls);
  }
  else {
    removeClass(ele,cls);
  }
}

module.exports.loadStylesheet = function(stylesheet,d) {
  d = document || d;
  var link = document.createElement('link');
  link.href = stylesheet;
  link.type = 'text/css';
  link.media = 'all';
  link.rel = 'stylesheet';
  d.head.appendChild(link);
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*\
|*|
|*|	:: cookies.js ::
|*|
|*|	A complete cookies reader/writer framework with full unicode support.
|*|
|*|	Revision #1 - September 4, 2014
|*|
|*|	https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|	https://developer.mozilla.org/User:fusionchess
|*|	https://github.com/madmurphy/cookies.js
|*|
|*|	This framework is released under the GNU Public License, version 3 or later.
|*|	http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|	Syntaxes:
|*|
|*|	* docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|	* docCookies.getItem(name)
|*|	* docCookies.removeItem(name[, path[, domain]])
|*|	* docCookies.hasItem(name)
|*|	* docCookies.keys()
|*|
\*/

var docCookies = {
	getItem: function (sKey) {
		if (!sKey) { return null; }
		return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
	},
	setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
		if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
		var sExpires = "";
		if (vEnd) {
			switch (vEnd.constructor) {
				case Number:
					sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
					break;
				case String:
					sExpires = "; expires=" + vEnd;
					break;
				case Date:
					sExpires = "; expires=" + vEnd.toUTCString();
					break;
			}
		}
		document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
		return true;
	},
	removeItem: function (sKey, sPath, sDomain) {
		if (!this.hasItem(sKey)) { return false; }
		document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
		return true;
	},
	hasItem: function (sKey) {
		if (!sKey) { return false; }
		return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
	},
	keys: function () {
		var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
		for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
		return aKeys;
	}
};

if(typeof module !== "undefined" && typeof module.exports !== "undefined") {
	module.exports = docCookies;
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const docCookies = __webpack_require__(1);
const utils = __webpack_require__(0);
(function(w, d, undefined) {
  //remove no js class from body
  utils.removeClass(d.body, 'no-js');

  //handle stylesheet cookies:::
  var stylesheet;
  //does this person already have a cookie set for which style they want?
  if(docCookies.getItem('roobottom-com-style')) {
    //read the cookie:
    stylesheet = docCookies.getItem('roobottom-com-style');
  }

  //if stylesheet isn't undefined || null, then load these styles
  if(stylesheet) {
    utils.loadStylesheet('/' + stylesheet);
  };


}(window,document));


/***/ })
/******/ ]);