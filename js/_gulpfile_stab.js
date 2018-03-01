// I Подключаем пакеты и сохраняем в переменные:
// названия аргументов в функциях require() должны быть такими же, как и в devDependencies (package.json)
var gulp         = require('gulp'),
    browserSync  = require('browser-sync'),
    watch        = require('gulp-watch'),
    del          = require('del'),
    cache        = require('gulp-cache'),
    rigger       = require('gulp-rigger'),
    // компиляция less и scss
    plumber      = require('gulp-plumber'),
    scss         = require('gulp-sass'),
    less         = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    csscomb      = require('gulp-csscomb'),
    postcss      = require('gulp-postcss'),
    mqpacker     = require('css-mqpacker'),
    // Сжатие изображений
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    // Конкатинация и минификация
    uglify       = require('gulp-uglify'),                // min    js-файлов
    cssnano      = require('gulp-cssnano'),               // min    css-файлов
    rename       = require('gulp-rename');                // изменение названий файлов


// II Сохраняем пути
var path = {
  // Исходники
  src: {
    html:       'src/*.html',
    less:       'src/less/style.less',
    scss:       'src/scss/style.scss',
    jsLibs:     'src/js/all-libs.js',
    jsMain:     'src/js/main.js',
    img:        'src/img/**/*.*',
    fonts:      'src/fonts/**/*.*'
  },

  watch: {
    html:      ['src/*.html', 'src/html/**/*.html'],
    less:      ['src/less/**/*.less', 'src/_lib/**/*.less'],
    scss:      ['src/less/**/*.scss', 'src/_lib/**/*.scss']
  },
  // Сборка
  dist: {
    html:  'dist/',
    css:   'dist/css/',
    js:    'dist/js/',
    img:   'dist/img/',
    fonts: 'dist/fonts/'
  },
  // Удалять директорию при новой сборке
  clean: './dist'
};


// III Настройка пакетов:
// BROWSER-SYNC
gulp.task('browser-sync', function() {
  browserSync({
    server: { baseDir: './dist/' },
    notify: true // Окна оповещения
  });
  // browserSync.init({proxy: 'front-end.loc'}); // если через локальный сервер
  // в OpenServer dir_name/src/
  // browser-sync start --server --directory --files "**/*" // без gulp
});

// WATCH-scss
gulp.task('ws', ['browser-sync'], function() {
  gulp.watch(path.watch.html,   ['html:build'],    browserSync.reload);
  gulp.watch(path.watch.scss,   ['scss:watch'],    browserSync.reload);
  gulp.watch(path.src.jsLibs,   ['js-libs:build'], browserSync.reload);
  gulp.watch(path.src.jsMain,   ['js-main:build'], browserSync.reload);
  gulp.watch(path.src.img,      ['img:build'],     browserSync.reload);
  gulp.watch(path.src.fonts,    ['fonts:build'],   browserSync.reload);
});

// WATCH-less
gulp.task('wl', ['browser-sync'], function() {
  gulp.watch(path.watch.html,   ['html:build'],    browserSync.reload);
  gulp.watch(path.watch.less,   ['less:watch'],    browserSync.reload);
  gulp.watch(path.src.jsLibs,   ['js-libs:build'], browserSync.reload);
  gulp.watch(path.src.jsMain,   ['js-main:build'], browserSync.reload);
  gulp.watch(path.src.img,      ['img:build'],     browserSync.reload);
  gulp.watch(path.src.fonts,    ['fonts:build'],   browserSync.reload);
});


// DEL (для удаления папки dist) работает при build
gulp.task('del', function() {
  return del.sync(path.clean);
});

// CLEAR cache 
gulp.task('clear', function() {
  return cache.clearAll();
});

// BUILD-DONE работает при build
gulp.task('build-done', function() {
  var Data = new Date();
  console.log('**************************************************************\n\nВЫПОЛНЕНА КОМАНДА |gulp build|\n\n' + Data + '\n\n**************************************************************');
});


// VI BUILD
// HTML-сборка
gulp.task('html:build', function () {
  gulp.src(path.src.html)
    .pipe(rigger())                                       // Прогоним через rigger
    .pipe(gulp.dest(path.dist.html))                      // Переместим их в папку build
    .pipe(browserSync.reload({stream: true}));
});

// SCSS-сборка
gulp.task('scss:build', function() {
  return gulp.src(path.src.scss)                          // путь к исходнику style.scss
  .pipe(plumber())                                        // Работа плагина plumber
  .pipe(scss())                                           // scss()
  .pipe(autoprefixer([                                    // Работа плагина autoprefixer 
    'last 15 versions',                                   // последние 15-ать версий браузеров
    '> 1%',                                               // для IE
    'ie 8',                                               // поддержка IE8
    'ie 7'                                                // поддержка IE7
  ], 
    { cascade: true }))                                   // Формаирование кода
  .pipe(csscomb())                                        // Комбинатор css-правил
  .pipe(postcss([
    mqpacker({sort: true})                                // Сортировка медиа-выражений
  ]))
  // .pipe(cssnano({zindex: false}))                         // минификация
  // .pipe(rename({suffix: '.min'}))                         // добавить суффикс min
  .pipe(gulp.dest(path.dist.css))                         // Название файла будет как у scss
  .pipe(browserSync.reload({stream: true}));              // Для перезагрузки сервера browser-sync при изменении
});

// SCSS-компиляция при WATCH
gulp.task('scss:watch', function() {
  return gulp.src(path.src.scss)                          // путь к исходнику style.scss
  .pipe(plumber())                                        // Работа плагина plumber
  .pipe(scss())                                           // scss()
  .pipe(gulp.dest(path.dist.css))                         // Название файла будет как у scss
  .pipe(browserSync.reload({stream: true}));              // Для перезагрузки сервера browser-sync при изменении
});


// LESS-сборка
gulp.task('less:build', function() {
  return gulp.src(path.src.less)                          // путь к исходнику style.less
  .pipe(plumber())                                        // Работа плагина plumber
  .pipe(less())                                           // less()
  .pipe(autoprefixer([                                    // Работа плагина autoprefixer 
    'last 15 versions',                                   // последние 15-ать версий браузеров
    '> 1%',                                               // для IE
    'ie 8',                                               // поддержка IE8
    'ie 7'                                                // поддержка IE7
  ], 
    { cascade: true }))                                   // Формаирование кода
  .pipe(csscomb())                                        // Комбинатор css-правил
  .pipe(postcss([
    mqpacker({sort: true})                                // Сортировка медиа-выражений
  ]))
  // .pipe(cssnano({zindex: false}))                         // минификация
  // .pipe(rename({suffix: '.min'}))                         // добавить суффикс min
  .pipe(gulp.dest(path.dist.css))                         // Директория сохранения, название файла будет как у less или scss
  .pipe(browserSync.reload({stream: true}));              // Для перезагрузки сервера browser-sync при изменении
});

// LESS-компиляция при WATCH
gulp.task('less:watch', function() {
  return gulp.src(path.src.less)                          // путь к исходнику style.less
  .pipe(plumber())                                        // Работа плагина plumber
  .pipe(less())                                           // less()
  .pipe(gulp.dest(path.dist.css))                         // Сохраняем, азвание файла будет как у less
  .pipe(browserSync.reload({stream: true}));              // Для перезагрузки сервера browser-sync при изменении
});

// JS-сборка
gulp.task('js-libs:build', function () {
  gulp.src(path.src.jsLibs)
    .pipe(rigger())                                       // если rigger, то concat не нужен
    .pipe(uglify())                                       // минификафия
    .pipe(rename({suffix: '.min'}))                       // переименование
    .pipe(gulp.dest(path.dist.js))
    .pipe(browserSync.reload({stream: true}));
});
gulp.task('js-main:build', function () {
  gulp.src(path.src.jsMain)
    .pipe(gulp.dest(path.dist.js))
    .pipe(browserSync.reload({stream: true}));
});

// FONTS-сборка
gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts))
    .pipe(browserSync.reload({stream: true}));
});

// IMG-сборка
gulp.task('img:build', function() {
  return gulp.src(path.src.img)
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    scgoPlugins: [{removeVievBox: false}],
    use: [pngquant()]
  })))
  .pipe(gulp.dest(path.dist.img))
  .pipe(browserSync.reload({stream: true}));
});

// ВСЯ СБОРКА
// build scss
gulp.task('bs', [
  'clear',
  'del',
  'html:build',
  'scss:build',
  'js-libs:build',
  'js-main:build',
  'fonts:build',
  'img:build',
  'build-done'
]);

// build less
gulp.task('bl', [
  'clear',
  'del',
  'html:build',
  'less:build',
  'js-libs:build',
  'js-main:build',
  'fonts:build',
  'img:build',
  'build-done'
]);
