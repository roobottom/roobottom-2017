'use strict';

const gulp = require('gulp');
const through = require('through2');
const nunjucks = require('nunjucks');
const path = require('path');
const del = require('del');

const $ = require('gulp-load-plugins')({
  rename: {
    'gulp-front-matter': 'fm'
  }
});

const opts = {
  publish_folder: './docs',
  categories: [
    {
      name: 'articles',
      source: './_source/posts/articles/*.md',
      template: './_source/templates/article.html'
    }
  ]
}

//testing web server
gulp.task('test_server',() => {
  $.connect.server({
    root: './docs',
    port: 8020,
    name: 'Test Server',
    livereload: true
  })
});

function applyTemplate(templateFile) {

  return through.obj(function (file, enc, cb) {
      var data = {
          page: file.page,
          content: file.contents.toString()
      };
      file.contents = new Buffer(nunjucks.render(path.join(__dirname, templateFile),data), 'utf8');
      this.push(file);
      cb();
  });
}

//HTML
gulp.task('html',() => {
    gulp.src('./_source/pages/**/*.html')
    .pipe($.nunjucks.compile())
    .pipe($.connect.reload())
    .pipe(gulp.dest(opts.publish_folder))
});

//Posts
gulp.task('posts',() => {

  opts['categories'].map((category) => {
    console.log('processing posts in ',category.name);

    gulp.src(category.source)
    .pipe($.fm({property: 'page', remove: true}))
    .pipe($.marked())
    .pipe(applyTemplate(category.template))
    .pipe(gulp.dest('./docs'))

  });

});

//wachers
gulp.task('watch',() => {
    gulp.watch(['./_source/pages/**/*.html'], ['html']);
});

gulp.task('default',['html','test_server','watch']);
