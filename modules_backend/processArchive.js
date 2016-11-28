'use strict';

const through = require('through2');
const gutil = require('gulp-util');

module.exports = function(basename, count, site) {

  var stream = through.obj(function(file, enc, cb) {
		this.push(file);
		cb();
	});

  if (site.posts)
  {
    var c     = 0;
    var page  = 0;
    var posts = [];

    var pagination = [];
    var pageCount = 0;

    site.posts.forEach(function (post) {
      if(c == count || c == 0) {

        let fromID = site.posts.length - (pageCount * c);
        let toID = site.posts.length - ((pageCount * c) + (count - 1));
        if (toID <= 0) {toID = 1;}

        let url;
        if(pageCount == 0) {
          url = '/' + basename;
        } else {
          url = '/' + basename + '/page-' + pageCount;
        }

        pagination.push({
          page: pageCount+1,
          items: count,
          from: fromID,
          to: toID,
          url: url,
          current: false
        });
        c=0;
        pageCount++;
      }
      c++;
    });


    c=0;
    site.posts.forEach(function (post) {
      posts.push(post);
      c++;

      if (c == count) {

        let outputPath;
        if(page==0) {
          outputPath = './' + basename + '/index.html';
        } else {
          outputPath = './' + basename + '/page-' + page + '/index.html';
        }

        var file = new gutil.File({
          path: outputPath,
          contents: new Buffer('')
        });

        pagination[page].current = true;
        file.page = {
          posts: posts,
          pagination: pagination
        };
        stream.write(file);

        //console.log(pagination);

        pagination[page].current = false;
        c = 0;
        posts = [];
        page++;

      }
    });

    if (posts.length != 0) {

      pagination.current = page + 1;

      var file = new gutil.File({
        path: './' + basename + '/page-' + page + '/index.html',
        contents: new Buffer('')
      });
      file.page = {
        posts: posts,
        pagination: pagination
        };
      stream.write(file);
    }
  }

  stream.end();
  stream.emit("end");

  return stream;
};
