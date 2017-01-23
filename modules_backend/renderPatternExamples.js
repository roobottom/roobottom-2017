'use strict';

const through = require('through2');
const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

var Remarkable = require('remarkable');
var md = new Remarkable({
  html: true
});

const env = nunjucks.configure('./_source',{autoescape:false});


module.exports = function() {
    return through.obj(function (file, enc, cb) {

        //read in the pattern file that's used in this example.
        var patternFile = path.join(__dirname, '../_source/patterns/' + file.example.type + '/' + file.example.name + '/' + file.example.name + '.html')
        var pattern = fs.readFileSync(patternFile);

        //find and replace all instances of nunjucks tags in the example
        var nunjucksTags = file.contents.toString().match(/{{.*}}/g);
        var markdownContent = file.contents.toString().replace(/{{.*}}/g,'<!--placeholder-->');

        //render markdown to HTML
        var markdownHTML = md.render(markdownContent.trim());

        //render nunjucks to HTML
        var nunjucksHTML = [];
        nunjucksTags.map((tag) => {
          nunjucksHTML.push(env.renderString(pattern.toString() + tag, file.example.data));
        });

        //now replace <!--placeholder--> with nunjucksHTML
        var placeholders = markdownHTML.match(/<!--placeholder-->/g);
        for(let i=0;i<placeholders.length;i++) {
          markdownHTML.replace(/<!--placeholder-->/,nunjucksHTML[i]);
          console.log('done');
        }
        console.log(markdownHTML);

        file.contents = new Buffer(file.contents, 'utf8');

        this.push(file);
        cb();
    });
}

function findNunjucks(string) {
  return string.match(/{{.*}}/g);
};
