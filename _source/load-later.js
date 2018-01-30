const c_fullscreen = require('./patterns/containers/c_fullscreen/c_fullscreen.js');
const m_switcher = require('./patterns/modules/m_switcher/m_switcher.js');
const m_figure = require('./patterns/modules/m_figure/m_figure.js');
const utils = require('./patterns/_shared/utils.js');

var clicky_site_ids = [101098446];

(function(w, d, undefined){
  c_fullscreen(w,d);
  m_switcher(w,d);
  m_figure(w,d);
}(window,document));
