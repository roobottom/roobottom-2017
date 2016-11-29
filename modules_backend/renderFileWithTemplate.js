'use strict';

const through = require('through2');
const nunjucks = require('nunjucks');
const nunjucks_env = new nunjucks.Environment(new nunjucks.FileSystemLoader('./_source'));
const path = require('path');
const fs = require('fs');

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
    //choosing to open the file manually, and render the template as a string
    //as nunjucks.render caches the file its passed, and the watch function doesn't work.
    var wrapper = fs.readFileSync(path.join(__dirname, '../'+templateFile),{encoding:'utf8'});
    file.contents = new Buffer(nunjucks_env.renderString(wrapper,data), 'utf8');
    this.push(file);
    cb();
  });
};
