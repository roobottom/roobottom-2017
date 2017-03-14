const util = require('../../_shared/utils.js');

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
