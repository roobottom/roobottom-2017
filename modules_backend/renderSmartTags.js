'use strict';

const through = require('through2');
const _ = require('lodash');
const path = require('path');
const nunjucks = require('nunjucks');
const nunjucks_env = new nunjucks.Environment(new nunjucks.FileSystemLoader('./_source'));

module.exports = function() {

  var tags = ['gallery','figure']

  return through.obj(function (file, enc, cb) {

    let count = 0;
    let fileobj = path.parse(file.path);
    file.page.id = fileobj.name;

    let replacedTags = [];
    let contents = file.contents.toString();

    //loop 
    for(var i in tags) {
      var regexp = new RegExp('<p>\\s*\\(' + tags[i] + '([^\\)]+)?\\)\\s*<\\/p>','igm');
      let match;
      while(match = regexp.exec(contents)) {
        let tagOpts = getTagOptions(match[1]);
        if(tags[i] == 'figure' || tags[i] == 'gallery') {
          var figure_object = {"images":[]};
          for(let i in file.page.images) {
            if(file.page.images[i].set === tagOpts.set) {
              figure_object["images"].push(file.page.images[i]);
            }
          };

          let renderedTag = nunjucks_env.render(path.join(__dirname, '../_source/patterns/modules/m_figure/m_figure.smartTag'),figure_object);
          replacedTags.push({
            old: match[0],
            new: renderedTag
          });

        }
      }
    }

    for(let n in replacedTags) {
      contents = contents.replace(replacedTags[n].old,replacedTags[n].new)
    };
    file.contents = new Buffer(contents, 'utf8');
    this.push(file);
    cb();
  });
};

var getTagOptions = function(match) {
    var terms = [];
    var items = _.trim(match).split(',');
    for(var i in items) {
        terms.push(items[i].split(':'));
    }
    return _.fromPairs(terms);
};
