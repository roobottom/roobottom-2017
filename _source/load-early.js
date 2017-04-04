const docCookies = require('./patterns/_shared/util.cookies.js');
const utils = require('./patterns/_shared/utils.js');
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
