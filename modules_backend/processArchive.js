'use strict';

const through = require('through2');
const gutil = require('gulp-util');

module.exports = function(basename, count, site) {

  var stream = through.obj(function(file, enc, cb) {
		this.push(file);
		cb();
	});

  if (site.posts) {

    //create pagination object
    var pagination = [];
    site.posts.forEach((post, index) => {
      if(index%10 == 0) {
        var url = pagination.length === 0 ? '' : 'page-' + pagination.length;
        pagination.push({
          posts: [],
          url: url
        });
      };
      pagination[pagination.length-1].posts.push(post);
    });

    //for each page in pagination, create a archive page
    pagination.forEach((page, index) => {
      var file = new gutil.File({
        path: calculateFileName(basename,index),
        contents: new Buffer('')
      });

      //var title = index === 0 ? 'Articles' : 'Articles, page ' + (index+1);

      file.page = {
        posts: pagination[index].posts,
        pagination: pagination,
        title: 'Articles',
        pageNumber: index + 1
      };
      stream.write(file);

    });

  };

  stream.end();
  stream.emit("end");

  return stream;
};

var calculateFileName = function(basename,index) {
  return index === 0 ? './' + basename + '/index.html' : './' + basename + '/page-' + index + '/index.html';
}
