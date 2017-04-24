'use strict';

const gulp = require('gulp');
const del = require('del');
const $ = require('gulp-load-plugins')({
  rename: {
    'gulp-front-matter': 'fm',
    'gulp-image-resize':'resize',
    'gulp-svg-sprite':'svgSprite',
    'gulp-clean-css':'cleanCss'
  }
});
const path = require('path');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const parallel = require('concurrent-transform');
const _ = require('lodash');

//posts
const updatePostsObject = require('./modules_backend/updatePostsObject');
const renderFileWithTemplate = require('./modules_backend/renderFileWithTemplate');
const processArchive = require('./modules_backend/processArchive');
const processTags = require('./modules_backend/processTags');
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

var mdOptions = {
  remarkableOptions: {
    preset: 'full',
    html: true,
    typographer: true,
    enable: ['abbr','footnote','deflist','footnote_inline','ins','mark','sub','sup']
  }
}

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
    .pipe($.remarkable(mdOptions))
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

gulp.task('articles:tags', ['articles:archives'], () => {
  return processTags('articles',10,site)
  .pipe(renderFileWithTemplate('./_source/templates/tag.html',site))
  .pipe($.htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest(site.publish_folder))
});

/*
02. Pattern Library
*/
gulp.task('pattern-library', ['articles:tags'], () => {
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
  .pipe($.remarkable(mdOptions))
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
    .pipe($.remarkable(mdOptions))
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
gulp.task('images:fullsize',() => {
  return gulp.src(site.images_folder)
  .pipe($.if(src => {
    let filename = path.parse(src.path);
    if (filename.ext == '.jpg' || filename.ext == '.jpeg')
      return true;
    },
    parallel(
      $.resize({
          width : 680,
          noProfile: true,
          crop : false,
          upscale : false
        })
    )
  ))
  .pipe(gulp.dest(site.publish_folder + '/images'))
});

gulp.task('images',['images:fullsize'])

/*
--. icons
*/

var svgSpriteConfig = {
  mode: {
    symbol: {
      dest: './',
      sprite: 'sprites.svg'
    }
  }
};

gulp.task('icons',() => {
  return gulp.src('./_source/icons/**/*')
  .pipe($.svgSprite(svgSpriteConfig))
  .pipe(gulp.dest('./docs/assets'))
})

/*
--. js
*/
gulp.task('js', () => {
  return gulp.src('./_source/load-early.js')
  .pipe(webpackStream({
    entry: {
      loadearly: './_source/load-early.js',
      loadlater: './_source/load-later.js'
    },
    output: {
      filename: '[name].js',
    }
  }, webpack))
  //.pipe($.uglify())
  .pipe(gulp.dest('./docs'))
});

/*
--. styles
*/


gulp.task('styles',()=> {
  return gulp.src(site.styles)
  .pipe($.sourcemaps.init())
  .pipe($.less())
  // .pipe($.cleanCss({
  //   level: {
  //     2: {
  //       all: true
  //     }
  //   }
  // }))
  .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
  }))
  .pipe($.sourcemaps.write('./'))
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
gulp.task('default',['server','styles','static','drafts','icons','js','watch']);

//build task. This does everything for one build.
gulp.task('build',['pages','styles','static','drafts','icons','js']);

//watchers
gulp.task('watch',['pages'],()=>{
  gulp.watch(['./_source/**/*'],['pages','styles','static','drafts','icons','js']);
});
