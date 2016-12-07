'use strict';

const gulp = require('gulp');
const del = require('del');
const $ = require('gulp-load-plugins')({
  rename: {
    'gulp-front-matter': 'fm',
    'gulp-image-resize':'resize'
  }
});
const path = require('path');


const updatePostsObject = require('./modules_backend/updatePostsObject');
const renderFileWithTemplate = require('./modules_backend/renderFileWithTemplate');
const processArchive = require('./modules_backend/processArchive');
const renderSmartTags = require('./modules_backend/renderSmartTags');

const site = require('./site');


/* util tasks */
gulp.task('clean',() => {
  return del([site.publish_folder]);
});

gulp.task('server',() => {
  $.connect.server({
    root: './docs',
    port: 8000,
    name: 'Test Server'
  })
});



/*
01. Patterns
*/
gulp.task('clean:patterns',(cb)=>{
  return del('_source/patterns/patterns.html');
    cb();
})

gulp.task('patterns',['clean:patterns'],(cb) => {
  return gulp.src('./_source/patterns/**/*.html')
  .pipe($.concat('patterns.html'))
  .pipe(gulp.dest('_source/patterns/'))
  cb();
});

/*
02. Articles
*/
gulp.task('clean:html',['patterns'], () => {
  return del(site.publish_folder + '/**/*.html');
});

gulp.task('articles:process', ['clean:html'], () => {
  return gulp.src(site.articles.source)
    .pipe($.fm({property: 'page', remove: true}))
    .pipe(updatePostsObject(site))
});

gulp.task('articles:render', ['articles:process'], () => {
  return gulp.src(site.articles.source)
    .pipe($.fm({property: 'page', remove: true}))
    .pipe($.marked())
    .pipe(renderSmartTags())
    .pipe(renderFileWithTemplate(site.articles.page,site))
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe($.rename((src)=> {
      src.dirname = 'articles/' + src.basename + '/';
      src.basename = 'index'
    }))
    .pipe(gulp.dest(site.publish_folder))
});

gulp.task('articles:archives', ['articles:render'], () => {
  return processArchive('articles',10,site)
  .pipe(renderFileWithTemplate(site.articles.archives,site))
  .pipe($.htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest(site.publish_folder))
});

/*
03. Pages
*/
gulp.task('pages', ['articles:archives'], () => {
  return gulp.src('./_source/pages/*.md')
  .pipe($.fm({property: 'page', remove: true}))
  .pipe($.marked())
  .pipe(renderFileWithTemplate(null,site))
  .pipe($.htmlmin({collapseWhitespace: true}))
  .pipe($.if(src => {
    let filename = path.parse(src.path);
    if (filename.name == 'home')
      return true;
    },
    $.rename(src => {
      src.basename = 'index',
      src.extname = '.html'
    }),
    $.rename(src => {
      src.dirname = src.basename + '/';
      src.basename = 'index',
      src.extname = '.html'
    })))
  .pipe(gulp.dest(site.publish_folder))
})

/*
--. images
*/
gulp.task('images',() => {
  return gulp.src(site.images_folder)
  .pipe($.resize({
      width : 600,
      noProfile: true,
      crop : false,
      upscale : false
    }))
  .pipe(gulp.dest(site.publish_folder + '/images'))
});

/*
--. styles
*/
gulp.task('styles',()=> {
  return gulp.src('_source/patterns/patterns.less')
  .pipe($.less())
  .pipe(gulp.dest(site.publish_folder))
})

//the default task. This will call the first step in the build-chain of pages
//pages and archives MUST be run in a set order.
gulp.task('default',['server','watch','styles']);

//watchers
gulp.task('watch',['pages'],()=>{
  gulp.watch(['./_source/**/*'],['pages','styles']);
});
