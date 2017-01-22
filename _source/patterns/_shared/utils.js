module.exports = function hasClass(elememt,className) {
  return element.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
};
