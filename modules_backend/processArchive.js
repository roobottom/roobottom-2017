'use strict';

const through = require('through2');
const gutil = require('gulp-util');
const moment = require('moment');

module.exports = function(basename, count, site) {

  var stream = through.obj(function(file, enc, cb) {
		this.push(file);
		cb();
	});

  //---------------
  // pagination
  //---------------
  if (site.posts) {

    //create pagination object
    var pagination = [];
    var dateRange = {};
    site.posts.forEach((post, index) => {
      if(index%10 == 0) {
        var url = pagination.length === 0 ? '' : 'page-' + pagination.length;
        dateRange.start = moment(post.date).format('YYYY');
        pagination.push({
          posts: [],
          url: url
        });
      };
      if(index%10 == 9 || index == site.posts.length - 1) {
        dateRange.end = moment(post.date).format('YYYY');
        pagination[pagination.length-1].dateRange = dateRange;
        dateRange = {};
      }
      pagination[pagination.length-1].posts.push(post);
    });

    //for each page in pagination, create a archive page
    pagination.forEach((page, index) => {
      var file = new gutil.File({
        path: calculatePaginationFileName(basename,index),
        contents: new Buffer('')
      });
      file.page = {
        posts: pagination[index].posts,
        pagination: pagination,
        paginationCurrent: index,
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

var calculatePaginationFileName = function(basename,index) {
  return index === 0 ? './' + basename + '/index.html' : './' + basename + '/page-' + index + '/index.html';
}
