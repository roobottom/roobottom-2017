'use strict';

const gulp = require('gulp');
const through = require('through2');
const nunjucks = require('nunjucks');
const path = require('path');
const del = require('del');
const fs = require('fs');

const nunjucks_env = new nunjucks.Environment(new nunjucks.FileSystemLoader('./_source'));

const $ = require('gulp-load-plugins')({
  rename: {
    'gulp-front-matter': 'fm'
  }
});

const site = {
  name: 'Roobottom.com',
  pages: [
    {
      url: '/',
      title: 'Home'
    },
    {
      url: '/articles',
      title: 'Articles'
    }
  ]
}

const opts = {
  publish_folder: './docs',
  pages_folder: './_source/pages/**/*',
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
gulp.task('html:pages',() => {
  gulp.src(opts.pages_folder)
  .pipe(renderPage())
  .pipe(gulp.dest(opts.publish_folder))
});

//posts
gulp.task('html:posts',() => {

  opts['categories'].map((category) => {
    gulp.src(category.source)
    .pipe($.fm({property: 'page', remove: true}))
    .pipe($.marked())
    .pipe(renderPost(category.template))
    .pipe($.rename((src)=> {
      src.dirname = category.name + '/' + src.basename + '/';
      src.basename = 'index'
    }))
    .pipe($.connect.reload())
    .pipe(gulp.dest(opts.publish_folder))

  });
});

//generate pages
gulp.task('html',['clean:html','html:pages','html:posts']);

//cleanup
gulp.task('clean:html',() => {
  return del([opts.publish_folder + '/**/*.html']);
});

//wachers
gulp.task('watch',() => {
  gulp.watch(['./_source/**/*.html'],['reload'])
});

//runners
gulp.task('default',['test_server','html','watch']);
gulp.task('reload',['html']);


//---
//custom functions
//---

function renderPost(templateFile) {
  return through.obj(function (file, enc, cb) {
      let data = {
          site: site,
          page: file.page,
          content: file.contents.toString()
      };
      var wrapper = fs.readFileSync(path.join(__dirname, templateFile),{encoding:'utf8'});
      file.contents = new Buffer(nunjucks_env.renderString(wrapper,data), 'utf8');
      this.push(file);
      cb();
  });
}

function renderPage() {
  return through.obj(function (file, enc, cb) {
    let orriginal = file.contents.toString();
    let data = {
      site: site
    }
    file.contents = new Buffer(nunjucks_env.renderString(orriginal,data), 'utf8');
    this.push(file);
    cb();
  });
}
