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
    var c = 1;
    var page = 0;
    var posts = [];

    var pagination = [{
      page: 0,
      url: '',
      posts: []
    }];
    var paginationPage = 0;

    //build pagination object
    site.posts.forEach(function(post) {
      pagination[paginationPage].posts.push(post);
      if(c==count) {
        c = 0;
        paginationPage++;
        pagination.push({
          page: paginationPage,
          url: 'page-' + paginationPage,
          posts: []
        });
      };
      c++;
    });

    //console.log(pagination);
    c=0;
    site.posts.forEach(function(post) {
      posts.push(post);
      c++;

      if (c == count) {

        var file = new gutil.File({
          path: calculateFileName(basename,page),
          contents: new Buffer('')
        });

        var title = page === 0 ? 'Articles' : 'Articles, page ' + (page+1)

        file.page = {
          posts: posts,
          page: page,
          pagination: pagination,
          title: title
        };
        stream.write(file);

        c = 0;
        posts = [];
        page++;

      }
    });

    if (posts.length != 0) {

      var file = new gutil.File({
        path: calculateFileName(basename,page),
        contents: new Buffer('')
      });
      file.page = {
        posts: posts,
        page: page,
        pagination: pagination,
        title: 'Articles, page ' + page
        };
      stream.write(file);
    }
  }

  stream.end();
  stream.emit("end");

  return stream;
};

var calculateFileName = function(basename,page) {
  return page === 0 ? './' + basename + '/index.html' : './' + basename + '/page-' + page + '/index.html';
}
