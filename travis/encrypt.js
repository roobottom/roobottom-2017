/*
this is will generate a Travis envitoment varible.
*/

var encrypt = require('travis-encrypt');
var token = "ENTER KEY HERE";

encrypt({
  repo: 'roobottom/roobottom-2017-live',
  data: 'GH_TOKEN=' + token
}, function (err, blob) {
  console.log(blob);
});
