/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

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

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const util = __webpack_require__(1);

module.exports = function(w,d) {
  console.log('c fullscreen loaded');
  var triggers = d.querySelectorAll('[data-fullscreen-trigger]');

  Array.prototype.forEach.call(triggers, function(el, i){
    var targetId = el.getAttribute('data-fullscreen-trigger');
    el.addEventListener('click', function(event) {
      //event.preventDefault();

      var fullscreen = d.querySelector(targetId);
      var openClass = 'c_fullscreen--is-open'

      console.log();
      util.addClass(fullscreen,openClass)


    });
  });
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function hasClass(ele,cls) {
  return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
};

module.exports = function addClass(ele,cls) {
	if (!hasClass(ele,cls)) {
    var classNames = ele.className.split(/\s+/);
    classNames.push(cls);
    ele.className = classNames.join(' ');
  }
};

module.exports = function removeClass(el,cls) {
	if (hasClass(el,cls)) {
		var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className=ele.className.replace(reg,' ');
	}
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const c_fullscreen = __webpack_require__(0);

(function(w, d, undefined){
  console.log('functionaliy loaded');
  c_fullscreen(w,d);
}(window,document));


/***/ })
/******/ ]);