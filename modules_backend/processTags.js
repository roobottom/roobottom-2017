'use strict';

const through = require('through2');
const gutil = require('gulp-util');

module.exports = function(basename, count, site) {

  var stream = through.obj(function(file, enc, cb) {
		this.push(file);
		cb();
	});

  //---------------
  // tags
  //---------------
  if(site.posts && site.tags) {

    //creat a tags object
    var postsWithTag = [];
    site.tags.forEach((tag, index) => {
      postsWithTag.push({
        name: tag.name,
        posts: []
      })
      site.posts.forEach((post) => {
        if(post.tags) {
          post.tags.forEach((postTag) => {
            if(postTag.toLowerCase() == tag.name) {
              postsWithTag[index].posts.push(post);
            }
          });
        };
      });
    });

    //create a page for each tag.
    postsWithTag.forEach((tag, index) => {
      var file = new gutil.File({
        path: './tags/' + tag.name.replace(/ /g, '-') + '/index.html',
        contents: new Buffer('')
      });
      file.page = {
        posts: tag.posts,
        tag: tag.name,
        title: 'Articles tagged ' + tag.name
      };
      stream.write(file);
    });

  }

  stream.end();
  stream.emit("end");
  return stream;

};
