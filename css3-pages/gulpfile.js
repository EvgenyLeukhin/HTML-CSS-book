// 1. Подгружаем плагины, сохраняем их в переменные после установки:

var gulp         = require('gulp'),											// Подгружаем сам gulp
		less         = require('gulp-less'),								// Подгружаем плагин less
		sass         = require('gulp-sass'),								// Подгружаем плагин sass
		browserSync  = require('browser-sync'),							// Подгружаем плагин browser-sync
		concat       = require('gulp-concat'),							// Подгружаем плагин concat
		concatCss    = require('gulp-concat-css'),					// Подгружаем плагин concat-css
		uglify       = require('gulp-uglify'),							// Подгружаем плагин uglify
		cssnano      = require('gulp-cssnano'),							// Подгружаем плагин cssnano
		rename       = require('gulp-rename'),							// Подгружаем плагин rename
		del          = require('del'),											// Подгружаем плагин del
		imageMin     = require('gulp-imagemin'),						// Подгружаем плагин gulp-imagemin
		pngquant     = require('imagemin-pngquant'),				// Подгружаем плагин imagemin-pngquant
		cache        = require('gulp-cache'),								// Подгружаем плагин cache
		autoprefixer = require('gulp-autoprefixer');				// Подгружаем плагин autoprefixer


// 2. Настойка плагинов:


// SASS (npm i gulp-sass --save-dev) !!! Почему-то криво работает с browser-sync (не сохраняет, если редактировать импортируемые sass-файлы)

gulp.task('sass', function() {													// Команда в консоли |gulp sass|
	return gulp.src('src/sass/style.sass')								// Исходники
	.pipe(sass())																					// Работа плагина sass
	.pipe(autoprefixer([																	// Работа плагина autoprefixer 
		'last 15 versions', 																// последние 15-ать версий браузеров
		'> 1%', 																						// для IE
		'ie 8', 																						// поддержка IE8
		'ie 7' 																							// поддержка IE7
	], 
		{ cascade: true }))																	// Формаирование кода
	.pipe(gulp.dest('src/css'))														// Директория сохранения, название файла будет как у sass
	.pipe(browserSync.reload({stream: true}));						// Для перезагрузки сервера browser-sync при изменении
});



// LESS (npm i gulp-less --save-dev)

gulp.task('less', function() {													// Команда в консоли |gulp less|
	return gulp.src('src/less/style.less')								// Исходники
	.pipe(less())																					// Работа плагина
	.pipe(autoprefixer([																	// Работа плагина autoprefixer 
		'last 15 versions', 																// последние 15-ать версий браузеров
		'> 1%', 																						// для IE
		'ie 8', 																						// поддержка IE8
		'ie 7' 																							// поддержка IE7
	], 
		{ cascade: true }))																	// Формаирование кода
	.pipe(gulp.dest('src/css'))														// Директория сохранения, название файла будет как у less
	.pipe(browserSync.reload({stream: true}));						// Для перезагрузки сервера browser-sync при изменении
});



// JS-CONCAT (ДЛЯ JS-БИБЛИОТЕК)

gulp.task('js-libs', function() {												// Команда в консоли |gulp js-libs|
	return gulp.src([																			// Перечень js-библиотек для конкатинации
		'src/js/libs/angular/angular.min.js', 
		'src/js/libs/bootstrap/dist/js/bootstrap.min.js',
		'src/js/libs/jquery/dist/jquery.min.js',
		'src/js/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		'src/js/libs/react/react.min.js'
	])
	.pipe(concat('libs.min.js'))													// Конкатинируем в готовый файл
	.pipe(uglify())																				// Минифицируем
	.pipe(gulp.dest('src/js'));														// Директория для готового файла 
});



// CSS-CONCAT (ДЛЯ CSS-БИБЛИОТЕК)

gulp.task('css-libs', function() {											// Команда в консоли |gulp css-libs|
	return gulp.src([ 																		// Пути к css-библиотекам
		'src/css/libs/1.css',
		'src/css/libs/2.css'
	])
	.pipe(concatCss('libs.min.css'))											// Конкатинируем в готовый файл
	.pipe(cssnano())																			// Минифицируем
	.pipe(gulp.dest('src/css/'));													// Директория для готового файла 
});



// CSS-ALL (libs + style)

gulp.task('css-all', ['css-libs'], function() {					// Команда в консоли |gulp css-all|
	return gulp.src([ 																		// Пути к css
		'src/css/libs.min.css',
		'src/css/style.css'
	])
	.pipe(concatCss('all.min.css'))												// Конкатинируем в готовый файл
	.pipe(cssnano())																			// Минифицируем
	.pipe(gulp.dest('src/css/'));													// Директория для готового файла 
});



// BROWSER-SYNC (npm i browser-sync --save-dev)

gulp.task('browser-sync', function() {									// Команда в консоли |gulp browser-sync|
	browserSync({
		server: {
			baseDir: 'src'																		// Указываем сервер-директорию
		},
		notify: true																				// Окна оповещения browser-sync
	});
});



// DEL (для удаления папки dist, нужно перед build)

gulp.task('del', function() {														// Команда в консоли |gulp del|
	return del.sync('dist');
});



// CLEAR (чистка кэша)

gulp.task('clear', function() {													// Команда в консоли |gulp clear| (пользоваться лучше вручную)
	return cache.clearAll();
});


// IMAGEMIN (сжатие изображений)

gulp.task('img', function() {														// Команда в консоли |gulp img|
	return gulp.src('src/img/**/*')												// Все изображения любых форматов
	.pipe(cache(imageMin({
		interlaced: true,
		progressive: true,
		scgoPlugins: [{removeVievBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('src/img_min/'));											// Куда сохранять обработанные
});



// WATCH (устанавливать не надо, стоит по умолчанию)

gulp.task('watch', ['browser-sync', 'less'], function() {					// Команда в консоли |gulp watch|, ['browser-sync и less'] запустится до watch
	gulp.watch('src/less/**/*.less', ['less']);											// Какие файлы вотчить и какой ['less'] при этом выполнять
	gulp.watch('src/**/*.html', browserSync.reload);								// Вотчим html-файлы и перезагружаем browserSync при редактировании html
	gulp.watch('src/js/**/*.js', browserSync.reload);								// Вотчим js-файлы и перезагружаем browserSync при редактировании js
});

gulp.task('watch-sass', ['browser-sync', 'sass'], function() {		// Команда в консоли |gulp watch-sass|, ['browser-sync и sass'] запустится до watch
	gulp.watch('src/sass/**/*.sass', ['sass']);											// Какие файлы вотчить и какой ['sass'] при этом выполнять
	gulp.watch('src/**/*.html', browserSync.reload);								// Вотчим html-файлы и перезагружаем browserSync при редактировании html
	gulp.watch('src/js/**/*.js', browserSync.reload);								// Вотчим js-файлы и перезагружаем browserSync при редактировании js
});



// BUILD (сохранение готовых файлов проекта)

gulp.task('build', ['del', 'img', 'less', 'css-all'], function() {	// Команда в консоли |gulp build|
	var buildCss = gulp.src([
		'src/css/*.css'
	])
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('src/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src('src/js/**/*')
	.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('src/**/*.html')
	.pipe(gulp.dest('dist'));

	var buildImg = gulp.src('src/img-min/**/*')
	.pipe(gulp.dest('dist/img'));
});



// 2.1 Кастомный таск (можно создать самому)

gulp.task('mytask', function() {												// команда в консоли | gulp mytask | и отобразится фраза в консоли
	console.log('********\n\tМОЖНО \n\tТАК \n\tСОЗДАВАТЬ \n\tСВОИ \n\tТАСКИ \n********');
	var a, b, c;
	a = 0.1; 
	b = 0.2;
	c = a + b;
	console.log('a = ' + a, '\nb = ' + b, '\na + b = ' + c);
});


/*

Установка gulp (http://gulpjs.com/)
************************************

1. Устанавливаем node.js
		(https://nodejs.org/en/)

2. Устанавливаем gulp глобально (делается 1 раз)
		npm i gulp -g 
		npm gulp -v (проверяем)

3. Встаём в папку с проектом и инициализируем проект
		npm init
		и отвечаем на вопросы, появится (package.json)

4. Устанавливаем gulp локально 
		npm i gulp --save-dev

5. Создаём директории в проекте (src, dist)

6. Устанавливаем плагины: 
		less         |npm i gulp-less --save-dev|							less2css
		sass         |npm i gulp-sass --save-dev|							sass2css
		browser-sync |npm i browser-sync --save-dev|					локальный сервер
		concat			 |npm i gulp-concat --save-dev| 					конкатинация js-файлов
		concat-css   |npm i gulp-concat-css --save-dev| 			конкатинация css-файлов
		uglify			 |npm i gulp-uglifyjs --save-dev|					минификация js-файлов
		cssnano			 |npm i gulp-cssnano --save-dev|					минификация css-файлов
		rename			 |npm i gulp-rename --save-dev|						переименование css-файлов
		imagemin		 |npm i cacheimagemin --save-dev|					сжатие изображений
		pngquant		 |npm i imagemin-pngquant --save-dev|			сжатие изображений pngquant
		del					 |npm i del --save-dev|										удаление папок (команда пишется без gulp)
		cache				 |npm i gulp-cache --save-dev|						кэш
		autoprefixer |npm i gulp-autoprefixer --save-dev|			autoprefixer

7. Создаём файл настроек (gulpfile.js)

8. Ставим библиотеки |bower i jquery magnific-popup| 
	 Создаём .bowerrc
{
	"directory": "app/js/libs/"
}

9. Конкатинируем и минимизируем все js-библиотеки командой |gulp js-libs|

10. Конкатинируем и минимизируем все css-библиотеки командой |gulp css-libs|

11. Включаем |gulp-watch-less| и работаем

12. Когда стили готовы, запускаем |gulp css-all| 

13. Запускаем |gulp build|, сборка в /dist


!!! ATENSION !!!
Если есть готовый файл package.json, то можно его скопировать в новый проект и запустить команду в консоли
(в этой новой директории) | npm i |, в этом случае поставяться все плагины, который указаны в package.json

*/