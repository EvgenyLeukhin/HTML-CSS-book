// Плагины:
var gulp         = require('gulp'),
    watch        = require('gulp-watch'),
    browserSync  = require('browser-sync'),
    cache        = require('gulp-cache'),
    
    // Компиляция scss-кода
    plumber      = require('gulp-plumber'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    postcss      = require('gulp-postcss'),
    mqpacker     = require('css-mqpacker'),
    csscomb      = require('gulp-csscomb');


// SASS
gulp.task('sass', function() {
    return gulp.src('./scss/style.scss')
    .pipe(plumber())
    .pipe(sass())
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
gulp.task('w', ['sass', 'browser-sync'], function() {
    gulp.watch('./scss/**/*.scss', ['scss'], browserSync.reload);
    gulp.watch('./*.html',                browserSync.reload);
});
