var gulp = require('gulp');
var bower = require('gulp-bower');
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

gulp.task('default', ['build']);
gulp.task('build', ['app', 'styles']);

gulp.task('app', ['bower', 'images'], function() {
  return gulp.src(mainBowerFiles('**/**.js'))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('static/'));
});

gulp.task('styles', ['bower'], function() {
  return gulp.src(mainBowerFiles('**/**.css'))
    .pipe(concatCss('styles.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('static/'));
});

gulp.task('images', ['bower'], function() {
  return gulp.src(mainBowerFiles('**/img/**'))
    .pipe(gulp.dest('static/img'));
});

gulp.task('bower', function() {
  return bower();
});
