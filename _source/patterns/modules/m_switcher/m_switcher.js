const utils = require('../../_shared/utils.js');
const docCookies = require('../../_shared/util.cookies.js');

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
