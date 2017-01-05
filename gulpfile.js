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


//posts
const updatePostsObject = require('./modules_backend/updatePostsObject');
const renderFileWithTemplate = require('./modules_backend/renderFileWithTemplate');
const processArchive = require('./modules_backend/processArchive');
const renderSmartTags = require('./modules_backend/renderSmartTags');
//patterns
const updatePatternsObject = require('./modules_backend/updatePatternsObject');
const renderPatternExamples = require('./modules_backend/renderPatternExamples');

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
01. Articles
*/
gulp.task('articles:process', () => {
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
02. Pattern Library
*/
gulp.task('pattern-library', ['articles:archives'], () => {
  return gulp.src('./_source/patterns/**/*.md')
  .pipe($.fm({property: 'meta', remove: true}))
  .pipe(updatePatternsObject(site))
  .pipe(renderPatternExamples())
  .pipe(renderFileWithTemplate('./_source/templates/pattern.html',site))
  .pipe($.htmlmin({collapseWhitespace: true}))
  .pipe($.rename(src => {
    src.dirname = 'patterns/' + src.basename;
    src.basename = 'index';
    src.extname = '.html';
  }))
  .pipe(gulp.dest(site.publish_folder))
});

/*
03. Pages
*/
gulp.task('pages', ['pattern-library'], () => {
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
      src.basename = 'index';
      src.extname = '.html';
    }),
    $.rename(src => {
      src.dirname = src.basename + '/';
      src.basename = 'index';
      src.extname = '.html';
    })))
  .pipe(gulp.dest(site.publish_folder))
})


/*
--. drafts
*/
gulp.task('drafts',()=>{
  return gulp.src(site.drafts.source)
    .pipe($.fm({property: 'page', remove: true}))
    .pipe($.marked())
    .pipe(renderSmartTags())
    .pipe(renderFileWithTemplate(site.drafts.page,site))
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe($.rename((src)=> {
      src.dirname = 'drafts/' + src.basename + '/';
      src.basename = 'index'
    }))
    .pipe(gulp.dest(site.publish_folder))
});


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

/*
--. static files
*/
gulp.task('static',() => {
  return gulp.src('_source/static/**/*')
  .pipe(gulp.dest(site.publish_folder))
})



//the default task. This will call the first step in the build-chain of pages
//pages and archives MUST be run in a set order.
gulp.task('default',['server','styles','static','drafts','watch']);

//build task. This does everything for one build.
gulp.task('build',['pages','styles','static','drafts']);

//watchers
gulp.task('watch',['pages'],()=>{
  gulp.watch(['./_source/**/*'],['pages','styles','static','drafts']);
});
