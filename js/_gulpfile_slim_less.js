// Плагины:
var gulp       = require('gulp'),
  watch        = require('gulp-watch'),
  browserSync  = require('browser-sync'),
  cache        = require('gulp-cache'),

  // Компиляция scss-кода
  plumber      = require('gulp-plumber'),
  less         = require('gulp-less'),
  autoprefixer = require('gulp-autoprefixer'),
  postcss      = require('gulp-postcss'),
  mqpacker     = require('css-mqpacker'),
  csscomb      = require('gulp-csscomb'),

  // Минификация css-кода
  cssnano      = require('gulp-cssnano'),
  rename       = require('gulp-rename');


// LESS
gulp.task('less', function() {
  return gulp.src('./less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer([
      'last 15 versions',
      '> 1%',
      'ie 8',
      'ie 7'
    ],
    { cascade: true }))
    .pipe(csscomb())
    .pipe(postcss([
      mqpacker({sort: true})
    ]))
  // .pipe(cssnano({zindex: false}))   // минификация
  // .pipe(rename({suffix: '.min'}))   // добавить суффикс min
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({stream: true}));
});


// BROWSER-SYNC
gulp.task('browser-sync', function() {
  browserSync({
    server: { baseDir: './' },
    notify: true,
  });
});

// CLEAR cache
gulp.task('clear', function() {
  return cache.clearAll();
});


// WATCH
gulp.task('w', ['less', 'browser-sync'], function() {
  gulp.watch('./less/**/*.less', ['less'], browserSync.reload);
  gulp.watch('./*.html',                   browserSync.reload);
  gulp.watch('./js/**/*.js',               browserSync.reload);
});
