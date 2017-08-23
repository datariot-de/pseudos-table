/**
 * Load libraries
 */
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var changed     = require('gulp-changed');
var watch       = require('gulp-watch');
var connect     = require('gulp-connect');
var opn         = require('opn');
var concat      = require('gulp-concat');
var normalize   = require('node-normalize-scss');
var reset       = require('node-reset-scss');

/**
 * Definitions for this project
 */
var sourcePaths = {
  styles: ['src/styles/**/*.scss'],
  html: ['src/**/*.html'],
  js: ['src/js/*.js'],
  images: ['src/images/**/*']
};

var destPaths = {
  styles: 'dist/css',
  html: 'dist',
  js: 'dist/js',
  images: 'dist/images',
};

var server = {
  host: 'localhost',
  port: '8080'
};

/**
 * Tasks
 */

/**
 * HTML Task
 *
 *  - Copy images to build folder
 */
gulp.task('html', function() {
  gulp.src(sourcePaths.html)
    .pipe(gulp.dest(destPaths.html))
    .pipe(connect.reload());
});

/**
 * Styles Task
 *
 *  - Compile Sass to Css
 *  - Copy files to build folder
 */
gulp.task('styles', function() {
  gulp.src(sourcePaths.styles)
    .pipe(sass({
      includePaths: normalize.with(reset.includePath)
    }).on('error', sass.logError))
    .pipe(gulp.dest(destPaths.styles))
    .pipe(connect.reload());
});

/**
 * Javascript Task
 *
 *  - Concatenate all js files
 *  - Copy file to build folder
 */
gulp.task('js', function() {
  gulp.src(sourcePaths.js)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(destPaths.js))
    .pipe(connect.reload());
});

/**
 * Images Task
 *
 *  - Copy images to build folder
 */
gulp.task('images', function() {
  return gulp.src(sourcePaths.images)
    .pipe(changed(destPaths.images)) // Ignore unchanged files
    .pipe(gulp.dest(destPaths.images))
    .pipe(connect.reload());
});

/**
 * Watch task
 *
 *  - Watch HTML, Sass, Javascript and image files
 */
gulp.task('watch', function() {
  gulp.watch(sourcePaths.styles, ['styles']);
  gulp.watch(sourcePaths.html, ['html']);
  gulp.watch(sourcePaths.js, ['js']);
  gulp.watch(sourcePaths.images, ['images']);
});

/**
 * Openbrowser Task
 *
 *  - Open the browser with url
 */
gulp.task('openbrowser', function() {
  opn('http://' + server.host + ':' + server.port);
});

/**
 * Webserver Task
 *
 *  - Runs the Webserver
 */
gulp.task('webserver', ['watch'], function() {
  connect.server({
    root: 'dist',
    port: server.port,
    base: server.host,
    livereload: true,
  });
});

// build task
gulp.task('build', ['styles', 'html', 'js', 'images']);
// default task
gulp.task('default', ['build', 'webserver', 'watch', 'openbrowser']);
