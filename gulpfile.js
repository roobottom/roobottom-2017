'use strict';

const gulp = require('gulp');
const through = require('through2');
const nunjucks = require('nunjucks');
const path = require('path');
const del = require('del');
const fs = require('fs');

const $ = require('gulp-load-plugins')({
  rename: {
    'gulp-front-matter': 'fm'
  }
});

const opts = {
  publish_folder: './docs',
  pages_folder: './source/pages/**/*',
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

//static pages
gulp.task('pages',['clean'],() => {
  gulp.src(opts.pages_folder)
  .pipe(applyPage())
  .pipe($.connect.reload())
  .pipe(gulp.dest(opts.publish_folder))
});

//posts
gulp.task('posts',['clean'],() => {

  opts['categories'].map((category) => {
    gulp.src(category.source)
    .pipe($.fm({property: 'page', remove: true}))
    .pipe($.marked())
    .pipe(applyTemplate(category.template))
    .pipe($.rename((src)=> {
      src.dirname = category.name + '/' + src.basename + '/';
      src.basename = 'index'
    }))
    .pipe($.connect.reload())
    .pipe(gulp.dest(opts.publish_folder))

  });

});

//cleanup
gulp.task('clean',() => {
  return del([opts.publish_folder]);
});

//wachers
gulp.task('watch',() => {
  gulp.watch(['./_source/**/*.html'],['posts'])
});

//runners
gulp.task('default',['test_server','posts','watch']);




//---
//custom functions
//---

function applyTemplate(templateFile) {
  return through.obj(function (file, enc, cb) {
      let data = {
          page: file.page,
          content: file.contents.toString()
      };
      var wrapper = fs.readFileSync(path.join(__dirname, templateFile),{encoding:'utf8'});
      file.contents = new Buffer(nunjucks.renderString(wrapper,data), 'utf8');
      this.push(file);
      cb();
  });
}

function applyPage() {
  return through.obj((file,enc,cb) => {
    console.log(file);
    file.contents = new Buffer(nunjucks.render(path.join(__dirname, file)), 'utf8');
    this.push(file);
    cb();
  });
}
