'use strict';

const through = require('through2');
const sizeOf = require('image-size');
const path = require('path');
const fs = require('fs');

module.exports = function() {

  let imagesMetaString = [];
  return through.obj(function(file, enc, cb) {

    //get width and height of image
    let filetype = path.extname(file.path)
    if(filetype == '.jpg' || filetype == '.png' || filetype == '.jpeg') {


      let dimensions = sizeOf(file.path);
      let FileName = path.parse(file.path);


      //data to push to metafile
      let jsonObj = {};
      jsonObj.image = FileName.base;
      jsonObj.width = dimensions.width;
      jsonObj.height = dimensions.height;

      //push to meta string
      imagesMetaString.push(jsonObj);
    };

		this.push(file);
		cb();
	},
  function(cb) {
    fs.writeFile(path.join(__dirname,'../_images/meta.js'), JSON.stringify(imagesMetaString), function(err) {
      if(err) {return console.log(err);}
    })
    cb();
  });



};
