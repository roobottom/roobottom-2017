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
