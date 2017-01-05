'use strict';

const through = require('through2');
const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');

const templateFile = null;

const env = nunjucks.configure('./_source',{
    noCache:true
});

module.exports = function(templateFile,site) {
  return through.obj(function (file, enc, cb) {

    let thisTemplate;
    if(!templateFile) { thisTemplate = './_source/templates/' + file.page.template; }
    else { thisTemplate = templateFile;}

    let fileobj = path.parse(file.path);
    file.page.id = fileobj.name;

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
