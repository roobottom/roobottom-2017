const c_fullscreen = require('./patterns/containers/c_fullscreen/c_fullscreen.js');
const m_switcher = require('./patterns/modules/m_switcher/m_switcher.js');
const m_figure = require('./patterns/modules/m_figure/m_figure.js');
const utils = require('./patterns/_shared/utils.js');

(function(w, d, undefined){
  c_fullscreen(w,d);
  m_switcher(w,d);
  m_figure(w,d);

  //gauges tracking script
  var _gauges = _gauges || [];
  var t   = d.createElement('script');
  t.type  = 'text/javascript';
  t.async = true;
  t.id    = 'gauges-tracker';
  t.setAttribute('data-site-id', '5a55f8e56eb5fb659f003fa9');
  t.setAttribute('data-track-path', 'https://track.gaug.es/track.gif');
  t.src = 'https://d2fuc4clr7gvcn.cloudfront.net/track.js';
  var s = d.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(t, s);
}(window,document));
