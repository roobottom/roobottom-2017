const util = require('../../_shared/utils.js');

module.exports = function(w,d) {//window,document
  var galleries = d.querySelectorAll('[data-gallery]');//select all galleries on this page
  var galleryItem = '[data-gallery-item]'; //the selector for each gallery item

  Array.prototype.forEach.call(galleries, function(gallery, i){
    let items = gallery.querySelectorAll(galleryItem);
    let imagenum = items.length;
    let totalwidth = gallery.offsetWidth;
    let usedwidth = 0;
    let ratios = [];
    let ratiosum = 0;

    Array.prototype.forEach.call(items, function(item, i){
      ratios.push(item.getAttribute('data-width') / item.getAttribute('data-height'));
      ratiosum += ratios[ratios.length - 1];
    });

    let ratioavg = ratiosum / imagenum;
    let totalpct = Math.floor((usedwidth / totalwidth) * 100) / 100;
    if (totalpct === 0) { totalpct = 1; }
    let eachpct = 1 / imagenum;

    Array.prototype.forEach.call(items, function(item, i){
      item.style.width = (((ratios[i] / ratioavg) * eachpct) * 100) + '%';
    });
  });

};
