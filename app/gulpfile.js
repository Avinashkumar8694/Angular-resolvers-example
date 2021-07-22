var gulp = require('gulp'),
  create = require('gulp-cordova-create'),
  version = require('gulp-cordova-version');
var del = require('del');
var fs = require('fs');


gulp.task('default',gulp.series(function () {
  return gulp.src('.')
    .pipe(version(require('./package.json').version));
}));

gulp.task('build-web', gulp.series(function () {
  return del([
    'dist/assets/Android',
    'dist/assets/iOS',
  ]);
}));

gulp.task('create-www', () => {
  if (!fs.existsSync('/www')) {
    return gulp.src('*.*', { read: false })
      .pipe(gulp.dest('./www'));
  }
});
