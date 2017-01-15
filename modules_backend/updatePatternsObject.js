'use strict';

const path = require('path');
const through = require('through2');
const gutil = require('gulp-util');
const _ = require('lodash');
const fs = require('fs');
const marked = require('marked');

module.exports = function(site) {
  let patterns = [];
  return through.obj(function (file, enc, cb) {

    let fileobj = path.parse(file.path);
    let dirArray = fileobj.dir.split('/').reverse();

    if(!file.meta.data && !file.meta.dataFile) {
      var err = new gutil.PluginError('Update Patterns Object', 'No data object or file in '+fileobj.name);
    }
    if(file.meta.dataFile) {
      try {
        let dataFile = path.join(__dirname, '../_source/patterns/' + dirArray[1] + '/' + fileobj.name + '/' + file.meta.dataFile.name);
        let dataFileContents = fs.readFileSync(dataFile).toString()
        if(file.meta.dataFile.markdown) {
          dataFileContents = marked(dataFileContents);
        }
        file.meta.data = {};
        file.meta.data[file.meta.dataFile.key] = dataFileContents;
      }
      catch (e) {
        var err = new gutil.PluginError('Update Patterns Object', 'Error loading data file for'+fileobj.name+'\n'+e);
      }
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
    patterns.push(file.example);
    cb(err);
  },
  function(cb) {

    //generate a new collection of patterns sorted by type
    let types = [];
    let obj = _.uniqBy(patterns,'type');
    for(let i in obj) {
      types.push({
        name: obj[i].type,
        patterns: []
      });
    }

    //push matching patterns into their type arrays
    for(let t in types) {
      for(let r in patterns) {
        if(patterns[r].type == types[t].name) {
          types[t].patterns.push(patterns[r]);
        }
      }
    }

    site.patterns = types;
    cb();
  });
}
