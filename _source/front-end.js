const c_fullscreen = require('./patterns/containers/c_fullscreen/c_fullscreen.js');

(function(w, d, undefined){
  console.log('functionaliy loaded');
  c_fullscreen(w,d);

  //move this to its own module.
  var svgPlayground = d.getElementById('c_svgPlayground');

}(window,document));
