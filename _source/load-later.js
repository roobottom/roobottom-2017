const c_fullscreen = require('./patterns/containers/c_fullscreen/c_fullscreen.js');
const m_switcher = require('./patterns/modules/m_switcher/m_switcher.js');
const utils = require('./patterns/_shared/utils.js');

(function(w, d, undefined){
  c_fullscreen(w,d);
  m_switcher(w,d);
}(window,document));
