'use strict';

const through = require('through2');
const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

const templateFile = null;

const env = nunjucks.configure('./_source',{
    noCache:true
})
.addFilter('removeWidows', require('./nunjucks_filters/removeWidows.filter.js'))

module.exports = function(templateFile,site) {
  return through.obj(function (file, enc, cb) {

    let thisTemplate;
    if(!templateFile) { thisTemplate = './_source/templates/' + file.page.template; }
    else { thisTemplate = templateFile;}

    file.page.type = thisTemplate.split('/').pop().split('.').shift();

    let fileobj = path.parse(file.path);
    file.page.id = fileobj.name;
    if(file.page.date) {
      file.page.humanDate = moment(file.page.date).format('dddd, MMMM Do YYYY');
    }

    let data = {
        site: site,
        page: file.page,
        contents: file.contents.toString()
    };

    var wrapper = fs.readFileSync(path.join(__dirname, '../'+thisTemplate),{encoding:'utf8'});
    file.contents = new Buffer(env.renderString(wrapper,data), 'utf8');

    this.push(file);
    cb();
  });
};
