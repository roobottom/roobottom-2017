const util = require('../../_shared/utils.js');

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
