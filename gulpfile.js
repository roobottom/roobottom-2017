'use strict';

const gulp = require('gulp');
const through = require('through2');
const nunjucks = require('nunjucks');
const nunjucks_env = new nunjucks.Environment(new nunjucks.FileSystemLoader('./_source'));

const path = require('path');
const del = require('del');
const fs = require('fs');
const gutil = require('gulp-util');
const _ = require('lodash');

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
    .pipe(updatePostsObject())
});

/*
render posts
*/

gulp.task('posts', ['posts:process'], () => {
  return gulp.src('./_source/posts/**/*.md')
    .pipe($.fm({property: 'page', remove: true}))
    .pipe($.marked())
    .pipe(renderSmartTags())
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
  return processArchive('articles',10)
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
      //console.log(posts[key].title);
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
    //console.log('bye!');
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

var processArchive = (basename, count) => {

  var stream = through.obj(function(file, enc, cb) {
		this.push(file);
		cb();
	});

  if (site.posts)
  {
    var c     = 0;
    var page  = 0;
    var posts = [];

    var pagination = [];
    var pageCount = 0;

    site.posts.forEach(function (post) {
      if(c == count || c == 0) {

        let fromID = site.posts.length - (pageCount * c);
        let toID = site.posts.length - ((pageCount * c) + (count - 1));
        if (toID <= 0) {toID = 1;}

        let url;
        if(pageCount == 0) {
          url = '/' + basename;
        } else {
          url = '/' + basename + '/page-' + pageCount;
        }

        pagination.push({
          page: pageCount+1,
          items: count,
          from: fromID,
          to: toID,
          url: url,
          current: false
        });
        c=0;
        pageCount++;
      }
      c++;
    });


    c=0;
    site.posts.forEach(function (post) {
      posts.push(post);
      c++;

      if (c == count) {

        let outputPath;
        if(page==0) {
          outputPath = './' + basename + '/index.html';
        } else {
          outputPath = './' + basename + '/page-' + page + '/index.html';
        }

        var file = new gutil.File({
          path: outputPath,
          contents: new Buffer('')
        });

        pagination[page].current = true;
        file.page = {
          posts: posts,
          pagination: pagination
        };
        stream.write(file);

        //console.log(pagination);

        pagination[page].current = false;
        c = 0;
        posts = [];
        page++;

      }
    });

    if (posts.length != 0) {

      pagination.current = page + 1;

      var file = new gutil.File({
        path: './' + basename + '/page-' + page + '/index.html',
        contents: new Buffer('')
      });
      file.page = {
        posts: posts,
        pagination: pagination
        };
      stream.write(file);
    }
  }

  stream.end();
  stream.emit("end");

  return stream;
}

var renderSmartTags = () => {

  var tags = ['gallery','figure']

  return through.obj(function (file, enc, cb) {
    for(var i in tags) {
      var regexp = new RegExp('<p>\\s*\\(' + tags[i] + '([^\\)]+)?\\)\\s*<\\/p>','igm');
      let match;
      let contents = file.contents.toString();
      while(match = regexp.exec(contents)) {
        let tagOpts = getTagOptions(match[1]);
        if(tags[i] == 'figure' || tags[i] == 'gallery') {
          var figure_object = {"images":[]};
          for(let i in file.page.images) {
            if(file.page.images[i].set === tagOpts.set) {
              figure_object["images"].push(file.page.images[i]);
            }
          };
          let renderedTag = nunjucks_env.render('./patterns/modules/m_figure/m_figure.smartTag',figure_object);
          file.contents = new Buffer(contents.replace(match[0],renderedTag), 'utf8');;
        }
      }
    }
    this.push(file);
    cb();
  });
};

var getTagOptions = function(match) {
    var terms = [];
    var items = _.trim(match).split(',');
    for(var i in items) {
        terms.push(items[i].split(':'));
    }
    return _.fromPairs(terms);
};
