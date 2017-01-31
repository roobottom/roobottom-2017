'use strict';

const path = require('path');
const through = require('through2');
const moment = require('moment');

const marked = require('marked');
const introMaxLength = 34;

module.exports = function(site) {
  let posts = [];
  return through.obj(function (file, enc, cb) {

    //extract the first real paragraph from the file contents
    var lexer = new marked.Lexer();
    var tokens = lexer.lex(file.contents.toString());
    var intro;
    for(let i in tokens) {
      if(tokens[i].type === 'paragraph' && !tokens[i].text.startsWith('[!') && !tokens[i].text.startsWith('(')) {
        intro = marked(tokens[i].text);
        break;
      }
    }

    //extract the id from the file path
    let fileobj = path.parse(file.path);
    file.page.id = fileobj.name;

    //extract the first image as the cover
    if(file.page.images) {
      file.page.cover = '/images/articles/' + file.page.id + '/' + file.page.images[0].image;
    }


    file.page.category = fileobj.dir.split('/').slice(-1)[0];
    file.page.humanDate = moment(file.page.date).format('dddd, MMMM Do YYYY');
    file.page.humanDateDay = moment(file.page.date).format('Do');
    file.page.humanDateMonth = moment(file.page.date).format('MMM');
    file.page.humanDateYear = moment(file.page.date).format('YYYY');
    file.page.intro = intro;
    posts.push(file.page);
    this.push(file);
    cb();
  },
  function(cb) {
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
    site.posts = posts;
    cb();
  });
}
