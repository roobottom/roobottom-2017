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
