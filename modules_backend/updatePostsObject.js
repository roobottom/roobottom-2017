/*
This file does the heavy lifting work of creating the site object.
It should be called `updateSiteObject`, but I haven't changed it yet.
All other pipes rely on this object.
*/
'use strict';

const path = require('path');
const through = require('through2');
const moment = require('moment');
const marked = require('marked');
const _ = require('lodash');

//remove any unwanted tags during md>html conversion with marked.
var renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
  return text;
}

module.exports = function(site) {
  let posts = [];
  return through.obj(function (file, enc, cb) {

    //extract the first real paragraph from the file contents
    var lexer = new marked.Lexer();
    var tokens = lexer.lex(file.contents.toString());
    var intro;
    for(let i in tokens) {
      if(tokens[i].type === 'paragraph' && !tokens[i].text.startsWith('[!') && !tokens[i].text.startsWith('(')) {
        intro = marked(tokens[i].text, {
          renderer: renderer,
          smartypants: true
        });
        break;
      }
    }

    //extract the id from the file path
    let fileobj = path.parse(file.path);
    file.page.id = fileobj.name;

    //extract the first image as the cover
    if(file.page.images) {
      var fullImage = file.page.images[0].image;
      var smallImage = fullImage.split('.jpg');
      file.page.cover = '/images/articles/' + file.page.id + '/' + smallImage[0] + '-small.jpg';
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
    let tags = [];
    for (let key in posts) {

      //add prev / next to posts object
      let next = parseInt(key)-1;
      let prev = parseInt(key)+1;
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

      //push raw tags into tags array
      if(posts[key].tags) {
        tags.push(posts[key].tags);
      }
    };

    //clean the tags array:
    tags = _.flatten(tags);
    for(let i in tags) {
      tags[i] = tags[i].toLowerCase();
    }
    //count instance of each tag:
    var tagsObject = {};
    tags.forEach(function(x) { tagsObject[x] = (tagsObject[x] || 0)+1; });
    //convert this to an array for sorting
    var tagsArray = [];
    for(let tag in tagsObject) {tagsArray.push([tag, tagsObject[tag]]);};
    tagsArray.sort(function(a, b) {return b[1] - a[1]});
    //convert back to a collection:
    let returnTags = []
    for(let tag in tagsArray) {
      returnTags.push({
        name: tagsArray[tag][0],
        count: tagsArray[tag][1]
      });
    }

    //update site object
    site.tags = returnTags;
    site.posts = posts;
    cb();
  });
}
