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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const c_fullscreen = __webpack_require__(4);
const m_switcher = __webpack_require__(5);
const m_figure = __webpack_require__(6);
const utils = __webpack_require__(0);

var clicky_site_ids = [101098446];

(function(w, d, undefined){
  c_fullscreen(w,d);
  m_switcher(w,d);
  m_figure(w,d);
}(window,document));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const util = __webpack_require__(0);

module.exports = function(w,d) {

  var OpenTriggers = d.querySelectorAll('[data-fullscreen-trigger]');
  var openClass = 'c_fullscreen--is-open';
  var closedClass = 'c_fullscreen--is-closed';
  var activeClass = 'c_fullscreen--is-active';

  //attach open triggers
  Array.prototype.forEach.call(OpenTriggers, function(el, i){

    var targetId = el.getAttribute('data-fullscreen-trigger');
    var fullscreen = d.querySelector(targetId);
    var body = d.querySelector('body');
    util.addClass(fullscreen,activeClass);
    util.addClass(fullscreen,closedClass);


    el.addEventListener('click', function(event) {
      event.preventDefault();
      util.addClass(fullscreen,openClass);
      util.removeClass(fullscreen,closedClass);
    });

    var close = d.querySelector('[data-fullscreen-close="'+targetId+'"]');

    if(close) {
      close.addEventListener('click', function(event) {
        event.preventDefault();
        util.removeClass(fullscreen,openClass);
        util.addClass(fullscreen,closedClass);
      });
    };


  });
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const utils = __webpack_require__(0);
const docCookies = __webpack_require__(1);

module.exports = function(w,d) {

  //handle showing / hiding the switch
  var switchers = d.querySelectorAll('[data-switch="switch"]');
  Array.prototype.forEach.call(switchers, function(el, i) {

    var trigger = el.querySelector('[data-switch="trigger"]');
    trigger.addEventListener('click', function(event) {
      event.preventDefault();
      utils.toggleClass(el,'m_switcher--is-active');
    });
  });

  //specific handling for styling switch
  var styleSwitches = d.querySelectorAll('[data-style]');
  Array.prototype.forEach.call(styleSwitches, function(el, i) {
    el.addEventListener('click', function(event) {
      event.preventDefault();
      closeSwitchers();
      var stylesheet = el.getAttribute('data-style');
      utils.loadStylesheet('/'+stylesheet);
      docCookies.setItem('roobottom-com-style', stylesheet, '31536e3', '/');
    });
  });

  //handle closing switcher
  var closeSwitchers = function() {
    Array.prototype.forEach.call(switchers, function(el, i) {
      utils.removeClass(el,'m_switcher--is-active');
    });
  };

};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const util = __webpack_require__(0);

module.exports = function(w,d) {//window,document
  var galleries = d.querySelectorAll('[data-gallery]');//select all galleries on this page
  var galleryItem = '[data-gallery-item]'; //the selector for each gallery item

  Array.prototype.forEach.call(galleries, function(gallery, i){
    let items = gallery.querySelectorAll(galleryItem);
    let imagenum = items.length;
    let totalwidth = gallery.offsetWidth;
    let usedwidth = 0;
    let ratios = [];
    let ratiosum = 0;

    Array.prototype.forEach.call(items, function(item, i){
      ratios.push(item.getAttribute('data-width') / item.getAttribute('data-height'));
      ratiosum += ratios[ratios.length - 1];
    });

    let ratioavg = ratiosum / imagenum;
    let totalpct = Math.floor((usedwidth / totalwidth) * 100) / 100;
    if (totalpct === 0) { totalpct = 1; }
    let eachpct = 1 / imagenum;

    Array.prototype.forEach.call(items, function(item, i){
      item.style.width = (((ratios[i] / ratioavg) * eachpct) * 100) + '%';
    });
  });

};


/***/ })
/******/ ]);