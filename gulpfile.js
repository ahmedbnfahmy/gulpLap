const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp")
const concat = require('gulp-concat');
const terser = require('gulp-terser');


var glubs={
  html:"project/*.html",
  css:"project/css/**/*.css",
  img:'project/pics/*',
  js:'project/js/**/*.js'
}

const imagemin = require('gulp-imagemin');

function imgMinify() {
    return gulp.src(glubs.img)
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
}

exports.img = imgMinify


const htmlmin = require('gulp-htmlmin');
function minifyHTML() {
    return src(glubs.html)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('dist'))
}

exports.html = minifyHTML





function jsMinify() {

    return src(glubs.js,{sourcemaps:true}) 
    
        .pipe(concat('all.min.js'))
        .pipe(terser())
        .pipe(dest('dist/assets/js',{sourcemaps:'.'}))
}
exports.js = jsMinify




var cleanCss = require('gulp-clean-css');
function cssMinify() {
    return src(glubs.css)
        .pipe(concat('style.min.css'))
        .pipe(cleanCss())
        .pipe(dest('dist/assets/css'))
}
exports.css = cssMinify

var browserSync = require('browser-sync');
function serve (cb){
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
  cb()
}

function reloadTask(done) {
  browserSync.reload()
  done()
}

//watch task
function watchTask() {
    watch(glubs.html,series(minifyHTML, reloadTask))
    watch(glubs.js,series(jsMinify, reloadTask))
    watch(glubs.css, series(cssMinify,reloadTask));
    watch(glubs.img, series(imgMinify,reloadTask));
}
exports.default = series( parallel(imgMinify, jsMinify, cssMinify, minifyHTML), serve , watchTask)




