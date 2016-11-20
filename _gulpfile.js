'use strict';

const gulp = require('gulp');
const through = require('through2');
const nunjucks = require('nunjucks');
const path = require('path');
const del = require('del');
const fs = require('fs');
const _ = require('lodash');

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
  publish_folder: './test',
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

//build the gloabl site object
gulp.task('site', () => {
  opts['categories'].map(category => {
    gulp.src(category.source)
    .pipe($.fm({property: 'page'}))
    .pipe(processPostsData(category.name))
  });
});

//1st posts
gulp.task('html:posts', () => {

  opts['categories'].map((category) => {
    gulp.src(category.source)
    .pipe($.fm({property: 'page', remove: true}))
    .pipe(processPostsData(category.name))
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

//2nd static pages
gulp.task('html:pages', ['html:posts'], () => {
  gulp.src(opts.pages_folder)
  //only rename and change the path if the file isn't the index file.
  .pipe($.if(src => {
    if (path.basename(src.path) != 'index.html')
      return true;
  }, $.rename(src => {
    src.dirname = src.basename + '/';
    src.basename = 'index'
  })))
  .pipe(renderPage())
  .pipe(gulp.dest(opts.publish_folder))
});

//generate pages
gulp.task('html',['patterns','html:posts']);

//cleanup
gulp.task('clean:html',() => {
  return del([opts.publish_folder + '/**/*.html']);
});

gulp.task('clean',() => {
  return del([opts.publish_folder]);
});

//wachers
gulp.task('watch',() => {
  gulp.watch(['./_source/**/*.html'],['reload'])
});

//runners
gulp.task('default',['html','test_server','watch']);
gulp.task('reload',['html']);


//---
//custom functions.
//this is based on this excellent work: https://github.com/rioki/www.rioki.org
//---

//render post pages.
function renderPost(templateFile) {
  console.log('renderPost', templateFile)
  return through.obj(function (file, enc, cb) {
      let data = {
          site: site,
          page: file.page,
          content: file.contents.toString()
      };
      //choosing to open the file manually, and render the template as a string
      //as nunjucks.render caches the file its passed, and the watch function doesn't work.
      var wrapper = fs.readFileSync(path.join(__dirname, templateFile),{encoding:'utf8'});
      file.contents = new Buffer(nunjucks_env.renderString(wrapper,data), 'utf8');
      this.push(file);
      console.log('renderPostEnd');
      cb();
  });
}

//render static pages
function renderPage() {
  return through.obj(function (file, enc, cb) {
    let orriginal = file.contents.toString();
    console.log('site',site);
    let data = {
      site: site
    }
    file.contents = new Buffer(nunjucks_env.renderString(orriginal,data), 'utf8');
    this.push(file);
    cb();
  });
}

//scan through all posts on the site and build a sub object
//for each post on the global site object
function processPostsData(category) {
  var posts = [];
  var c = 0;
  return through.obj((file, enc, cb) => {
    let fileobj = path.parse(file.path);
    file.page.id = fileobj.name;
    file.page.category = category;
    posts.push(file.page);
    cb();
  },
  (cb,file) => {
    posts.sort((a,b) => {
        return b.date - a.date;
    });
    for (let key in posts) {
      let next = parseInt(key)-1;
      let prev = parseInt(key)+1;

      if(next in posts) {
        posts[key].next = {};
        posts[key].next.title = posts[next].title;
        posts[key].next.id = posts[next].id;
        posts[key].next.date = posts[next].date;
      }
      if(prev in posts) {
        posts[key].prev = {};
        posts[key].prev.title = posts[prev].title;
        posts[key].prev.id = posts[prev].id;
        posts[key].prev.date = posts[prev].date;
      }
    };
    console.log(file);
    site.posts = posts;
    cb();
  });
}
