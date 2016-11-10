var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// gulp.task('jekyll', function (gulpCallBack){
//   var spawn = require('child_process').spawn;
//   var jekyll = spawn('jekyll', ['serve'], {stdio: 'inherit'});
//   jekyll.on('exit', function(code) {
//     gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: ' + code);
//   });
// });

//testing web server
gulp.task('test_server',() => {
  $.connect.server({
    root: './docs',
    port: 8020,
    name: 'Test Server',
    livereload: true
  })
});

//HTML
gulp.task('html',() => {
    gulp.src('./_source/pages/**/*.html')
    .pipe($.nunjucks.compile())
    .pipe($.connect.reload())
    .pipe(gulp.dest('./docs'))
});

//wachers
gulp.task('watch',() => {
    gulp.watch(['./_source/pages/**/*.html'], ['html']);
});

gulp.task('default',['html','test_server','watch']);
