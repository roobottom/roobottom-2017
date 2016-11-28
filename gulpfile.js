'use strict';

const gulp = require('gulp');
const del = require('del');
const updatePostsObject = require('./modules_backend/updatePostsObject');
const renderFileWithTemplate = require('./modules_backend/renderFileWithTemplate');
const processArchive = require('./modules_backend/processArchive');
const renderSmartTags = require('./modules_backend/renderSmartTags');
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

gulp.task('clean',() => {
  return del([opts.publish_folder]);
});

gulp.task('clean:patterns',()=>{
  return del('_source/patterns/patterns.html');
})

/*
merge patterns
*/
gulp.task('patterns',['clean:patterns'],() => {
  gulp.src('./_source/patterns/**/*.html')
  .pipe($.concat('patterns.html'))
  .pipe(gulp.dest('_source/patterns/'))
});

/*
process all posts
*/

gulp.task('posts:process', () => {
  return gulp.src('./_source/posts/**/*.md')
    .pipe($.fm({property: 'page', remove: true}))
    .pipe(updatePostsObject(site))
});

/*
render posts
*/

gulp.task('posts', ['posts:process'], () => {
  return gulp.src('./_source/posts/**/*.md')
    .pipe($.fm({property: 'page', remove: true}))
    .pipe($.marked())
    .pipe(renderSmartTags())
    .pipe(renderFileWithTemplate('./_source/templates/article.html',site))
    .pipe($.rename((src)=> {
      src.dirname = 'articles/' + src.basename + '/';
      src.basename = 'index'
    }))
    .pipe(gulp.dest(opts.publish_folder))
});

/*
render archive pages
*/
gulp.task('archives', ['posts'], () => {
  return processArchive('articles',10,site)
  .pipe(renderFileWithTemplate('./_source/pages/articles.html',site))
  .pipe(gulp.dest('./docs'))
});
