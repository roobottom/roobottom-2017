'use strict';

const gulp = require('gulp');
const through = require('through2');
const nunjucks = require('nunjucks');
const nunjucks_env = new nunjucks.Environment(new nunjucks.FileSystemLoader('./_source'));

const path = require('path');
const del = require('del');
const fs = require('fs');
const gutil = require('gulp-util');

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

/*
process all posts
*/
gulp.task('posts:process', () => {
  return gulp.src('./_source/posts/**/*.md')
    .pipe($.fm({property: 'page', remove: true}))
    .pipe(updatePostsObject())
});

/*
render posts
*/

gulp.task('posts', ['posts:process'], () => {
  return gulp.src('./_source/posts/**/*.md')
    .pipe($.fm({property: 'page', remove: true}))
    .pipe($.marked())
    .pipe(renderFileWithTemplate('./_source/templates/article.html'))
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
  return posts()
  .pipe(renderFileWithTemplate('./_source/pages/articles.html'))
  .pipe(gulp.dest('./docs'))
});

var updatePostsObject = () => {
  let posts = [];
  return through.obj(function (file, enc, cb) {
    let fileobj = path.parse(file.path);
    file.page.id = fileobj.name;
    file.page.category = fileobj.dir.split('/').slice(-1)[0];
    posts.push(file.page);
    this.push(file);
    cb();
  },
  (cb) => {
    posts.sort((a,b) => {
        return b.date - a.date;
    });
    for (let key in posts) {
      let next = parseInt(key)-1;
      let prev = parseInt(key)+1;
      console.log(posts[key].title);
      if(next in posts) {
        posts[key].next = {};
        posts[key].next.title = posts[next].title;
        posts[key].next.id = posts[next].id;
        posts[key].next.date = posts[next].date;
        posts[key].next.category = posts[next].category;
      }
      if(prev in posts) {
        posts[key].prev = {};
        posts[key].prev.title = posts[prev].title;
        posts[key].prev.id = posts[prev].id;
        posts[key].prev.date = posts[prev].date;
        posts[key].prev.category = posts[prev].category;
      }
    };
    console.log('bye!');
    site.posts = posts;
    cb();
  });
}

var renderFileWithTemplate = (templateFile) => {
  return through.obj(function (file, enc, cb) {
    let fileobj = path.parse(file.path);
    file.page.id = fileobj.name;
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
    cb();
  });
};

function posts(basename, count) {
  console.log('---------------- running posts! -----------');
  basename = 'artiles';
  count = 10;
  var stream = through.obj(function(file, enc, cb) {
		this.push(file);
		cb();
	});
  //console.log(site.posts);
  if (site.posts)
  {
    var c     = 0;
    var page  = 0;
    var posts = [];
    site.posts.forEach(function (post) {
      posts.push(post);
      c++;
      if (c == count) {
        var file = new gutil.File({
          path: basename + (page == 0 ? '' : page) + '.html',
          contents: new Buffer('')
        });
        //console.log('page=' + page + ' c=' + c + ' posts.length=' + site.posts.length);
        file.page = {
          posts: posts,
          prevPage: page != 0 ? basename + ((page-1) == 0 ? '' : page-1) + '.html' : null,
          nextPage: (page+1) * count < site.posts.length ? basename + (page+1) + '.html' : null,
          };
        stream.write(file);

        c = 0;
        posts = [];
        page++;
      }
    });

    if (posts.length != 0) {
      var file = new gutil.File({
        path: basename + (page == 0 ? '' : page) + '.html',
        contents: new Buffer('')
      });
      file.page = {
        posts: posts,
        prevPage: page != 0 ? basename + ((page-1) == 0 ? '' : page) + '.html' : null,
        nextPage: null,
        };
      stream.write(file);
    }
  }

  stream.end();
  stream.emit("end");

  return stream;
}
