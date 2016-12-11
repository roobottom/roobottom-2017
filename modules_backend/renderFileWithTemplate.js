'use strict';

const through = require('through2');
const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');

nunjucks.configure('./_source',{noCache:true});

module.exports = function(templateFile,site) {
  return through.obj(function (file, enc, cb) {
    
    if(!templateFile) templateFile = './_source/templates/' + file.page.template;
    let fileobj = path.parse(file.path);
    file.page.id = fileobj.name;
    
    let data = {
        site: site,
        page: file.page,
        content: file.contents.toString()
    };
    
    var wrapper = fs.readFileSync(path.join(__dirname, '../'+templateFile),{encoding:'utf8'});
    file.contents = new Buffer(nunjucks.renderString(wrapper,data), 'utf8');
    
    this.push(file);
    cb();
  });
};
