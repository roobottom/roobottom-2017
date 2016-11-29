'use strict';

const gulp = require('gulp');
const del = require('del');
const $ = require('gulp-load-plugins')({
  rename: {
    'gulp-front-matter': 'fm'
  }
});
const path = require('path');


const updatePostsObject = require('./modules_backend/updatePostsObject');
const renderFileWithTemplate = require('./modules_backend/renderFileWithTemplate');
const processArchive = require('./modules_backend/processArchive');
const renderSmartTags = require('./modules_backend/renderSmartTags');

const site = require('./site');

gulp.task('clean',() => {
  return del([site.publish_folder]);
});



/*
patterns
*/
gulp.task('clean:patterns',()=>{
  return del('_source/patterns/patterns.html');
})

gulp.task('patterns',['clean:patterns'],() => {
  return gulp.src('./_source/patterns/**/*.html')
  .pipe($.concat('patterns.html'))
  .pipe(gulp.dest('_source/patterns/'))
});

/*
Articles!
*/
gulp.task('clean:articles',() => {
  return del(site.publish_folder + '/articles');
});

gulp.task('articles:process', ['clean:articles'], () => {
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
    .pipe($.rename((src)=> {
      src.dirname = 'articles/' + src.basename + '/';
      src.basename = 'index'
    }))
    .pipe(gulp.dest(site.publish_folder))
});

gulp.task('articles:archives', ['articles:render'], () => {
  return processArchive('articles',10,site)
  .pipe(renderFileWithTemplate(site.articles.archives,site))
  .pipe(gulp.dest(site.publish_folder))
});

gulp.task('pages', () => {
  return gulp.src('./_source/pages/*.md')
  .pipe($.fm({property: 'page', remove: true}))
  .pipe($.marked())
  .pipe(renderFileWithTemplate(null,site))
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

//the default task. This will call the first step in the build-chain of pages
//pages and archives MUST be run in a set order.
gulp.task('default',['articles:archives','pages']);
