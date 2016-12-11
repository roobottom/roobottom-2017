'use strict';

const path = require('path');
const through = require('through2');
const gutil = require('gulp-util');

module.exports = function(site) {
  let patterns = [];
  return through.obj(function (file, enc, cb) {

    let fileobj = path.parse(file.path);
    let dirArray = fileobj.dir.split('/').reverse();

    if(!file.meta.data) {
      var err = new gutil.PluginError('Update Patterns Object', 'No data object in '+fileobj.name);
    }

    file.example = {
      name: fileobj.name,
      type: dirArray[1],
      data: file.meta.data
    }
    file.page = {
      title: file.meta.title
    }
    this.push(file);
    cb(err);
  },
  function(cb) {
    //sort the types into a new unique array of `types`
    cb();
  });
}
