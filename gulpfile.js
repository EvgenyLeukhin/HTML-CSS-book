// 1. Подгружаем плагины, сохраняем их в переменные после установки:

var gulp         = require('gulp'),											// gulp
		browserSync  = require('browser-sync'),							// локальный сервер, синхронизатор
		del          = require('del'),											// удалятор файлов
		cache        = require('gulp-cache'),								// очистка кэша
		rename       = require('gulp-rename'),							// переименовка фалов
		
		// Компиляция less-кода
		plumber      = require('gulp-plumber'),							// plumber (выполняет с ошибками, не останавливает) НЕ РАБОТАеТ!!!
		less         = require('gulp-less'),								// компилятор less - css
		autoprefixer = require('gulp-autoprefixer'),				// autoprefixer
		postcss      = require('gulp-postcss'),							// компилятор postcss - css
		mqpacker     = require('css-mqpacker'),							// mqpacker (объединяет медиа-выражения)

		// Конкатинация (вручную)
		concat       = require('gulp-concat'),							// объединение js-файлов
		concatCss    = require('gulp-concat-css'),					// объединение css-файлов

		// Минификация (вручную)
		uglify       = require('gulp-uglify'),							// минификатор js-файлов (вручную)
		cssnano      = require('gulp-cssnano'),							// минификатор css-файлов (вручную)

		// Сжатие изображений
		imageMin     = require('gulp-imagemin'),						// gulp-imagemin
		pngquant     = require('imagemin-pngquant'),				// imagemin-pngquant
		svgmin       = require('gulp-svgmin'),							// svgmin (svg-минификатор)
		svgstore     = require('gulp-svgstore'),						// svgstore (svg-спрайты) НЕ ИСПОЛЬЗОВАЛ ЕЩЁ!!!

		// Сжатие CSS
		csscomb      = require('gulp-csscomb'),							// csscomb (комбинатор css-правил)
		uncss        = require('gulp-uncss');								// uncss (удаляет дублирование css-правил)


// 2. Настойка плагинов:


// LESS (npm i gulp-less --save-dev)										style.less

gulp.task('less', function() {													// Команда в консоли |gulp less|
	return gulp.src('src/less/style.less')								// Исходники
	.pipe(plumber())																			// Работа плагина plumber
	.pipe(less())																					// Работа плагина less
	.pipe(autoprefixer([																	// Работа плагина autoprefixer 
		'last 15 versions', 																// последние 15-ать версий браузеров
		'> 1%', 																						// для IE
		'ie 8', 																						// поддержка IE8
		'ie 7' 																							// поддержка IE7
	], 
		{ cascade: true }))																	// Формаирование кода
	.pipe(postcss([
		mqpacker({sort: true})															// Сортировка медиа-выражений
	]))
	.pipe(uncss({																					// Удаление лишних правил
		html: ['index.html', 'posts/**/*.html', 'http://example.com']
	}))
	.pipe(csscomb.processPath('src/css'))
	.pipe(gulp.dest('src/css'))														// Директория сохранения, название файла будет как у less
	.pipe(browserSync.reload({stream: true}));						// Для перезагрузки сервера browser-sync при изменении
});



// CSS-MIN (минифицируем style.css) работает при build

gulp.task('css-min', function() {													// Команда в консоли |gulp css-min|
	return gulp.src('src/css/style.css')										// Пути к css
	.pipe(cssnano())																				// Минифицируем
	.pipe(rename('style.min.css'))													// Переименовываем
	.pipe(gulp.dest('src/css/'));														// Директория для готового файла 
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



// DEL (для удаления папки dist) работает при build

gulp.task('del', function() {														// Команда в консоли |gulp del|
	return del.sync('dist');
});



// CLEAR (чистка кэша) ВРУЧНУЮ!!!

gulp.task('clear', function() {													// Команда в консоли |gulp clear| (пользоваться лучше вручную)
	return cache.clearAll();
});


// IMAGEMIN (сжатие изображений) работает при build

gulp.task('img', function() {														// Команда в консоли |gulp img|
	return gulp.src('src/img/**/*')												// Все изображения любых форматов
	.pipe(cache(imageMin({
		interlaced: true,
		progressive: true,
		scgoPlugins: [{removeVievBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('src/img-min/'));											// Куда сохранять обработанные
});



// SVG-спрайты (символьный svg-спрайт через id) ВРУЧНУЮ!!! **********************надо посмотреть ещё

gulp.task('icons-sprite', function() {														// Команда в консоли |gulp icons-sprite|
	return gulp.src('src/img/icons/*.svg')													// Все изображения любых форматов
	.pipe(svgmin())																									// Минифицируем svg
	.pipe(svgstore({																								// Делаем спрайт
		inlineSvg: true
	}))
	.pipe(rename('icons-sprite.svg'))																// Переименовываем
	.pipe(gulp.dest('dist/img/'));																	// Куда сохранять обработанные
});



// WATCH (устанавливать не надо, стоит по умолчанию)

gulp.task('watch', ['browser-sync', 'less'], function() {		// Команда в консоли |gulp watch|, ['browser-sync и less'] запустится до watch
	gulp.watch('src/less/**/*.less', ['less']);											// Какие файлы вотчить и какой ['less'] при этом выполнять
	gulp.watch('src/**/*.html', browserSync.reload);								// Вотчим html-файлы и перезагружаем browserSync при редактировании html
	gulp.watch('src/js/**/*.js', browserSync.reload);								// Вотчим js-файлы и перезагружаем browserSync при редактировании js
});







// CSSCOMB (комбинатор css-правил) **********************надо посмотреть ещё

gulp.task('csscomb', function() {																	// Команда в консоли |gulp csscomb|
	return gulp.src('src/css/style.css')														// Выбираем style.css
	.pipe(csscomb())																								// Обрабатываем style.css
	.pipe(gulp.dest('src/css/'));																		// Куда сохранять обработанные
});



// UNCSS (убирает лишние css-правила)  **********************надо посмотреть ещё

gulp.task('uncss', function() {																		// Команда в консоли |gulp uncss|
	return gulp.src('src/css/style-comb.css')												// Выбираем style-comb.css
	.pipe(uncss({
		html: ['index.html', 'src/**/*.html', 'http://example.com']
	}))																															// Выбиаем все html-файлы
	.pipe(gulp.dest('src/css/'));																		// Куда сохранять обработанные
});



// BUILD-DONE работает при build

gulp.task('build-done', function() {		// Команда в консоли |gulp build-done|
	var Data = new Date();
	console.log('**************************************************************\n\nВЫПОЛНЕНА КОМАНДА |gulp build|\n\n' + Data + '\n\n**************************************************************');
});



// BUILD (сохранение готовых файлов проекта)

gulp.task('build', ['del', 'img', 'less', 'css-min', 'build-done'], function() {						// Команда в консоли |gulp build|
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
		less          |npm i gulp-less --save-dev|							less2css
		sass          |npm i gulp-sass --save-dev|							sass2css
		plumber       |npm i gulp-plumber --save-dev|					  plumber (если есть ошибки при компиляции css-препроцессора, то компиляция не будет остановлена)
		postcss       |npm i gulp-postcss --save-dev|					  postcss 
		browser-sync  |npm i browser-sync --save-dev|					  локальный сервер
		concat			  |npm i gulp-concat --save-dev| 					  конкатинация js-файлов
		concat-css    |npm i gulp-concat-css --save-dev| 		 	  конкатинация css-файлов
		uglify			  |npm i gulp-uglifyjs --save-dev|					минификация js-файлов
		cssnano			  |npm i gulp-cssnano --save-dev|				  	минификация css-файлов (есть ещё csso)
		rename			  |npm i gulp-rename --save-dev|						переименование css-файлов
		imagemin		  |npm i cacheimagemin --save-dev|					сжатие изображений
		pngquant		  |npm i imagemin-pngquant --save-dev|			сжатие изображений pngquant
		del					  |npm i del --save-dev|										удаление папок (команда пишется без gulp)
		cache				  |npm i gulp-cache --save-dev|					   	кэш
		autoprefixer  |npm i gulp-autoprefixer --save-dev|			autoprefixer
		css-mqpacker  |npm install css-mqpacker --save-dev|		  mqpacker
		gulp-svgstore |npm install gulp-svgstore --save-dev|		svg-спрайты
		gulp-svgmin   |npm install gulp-svgmin --save-dev|			svg-минификатор

npm i --save-dev gulp-less gulp-sass gulp-plumber gulp-postcss browser-sync gulp-concat gulp-concat-css

npm i --save-dev gulp-uglifyjs gulp-cssnano gulp-rename cache imagemin imagemin-pngquant

npm i --save-dev del gulp-cache gulp-autoprefixer css-mqpacker gulp-svgstore gulp-svgmin

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










// SASS (npm i gulp-sass --save-dev) !!! Почему-то криво работает с browser-sync (не сохраняет, если редактировать импортируемые sass-файлы)

// gulp.task('sass', function() {													// Команда в консоли |gulp sass|
// 	return gulp.src('src/sass/style.sass')								// Исходники
// 	.pipe(plumber())																			// Работа плагина plumber
// 	.pipe(sass())																					// Работа плагина sass
// 	.pipe(autoprefixer([																	// Работа плагина autoprefixer 
// 		'last 15 versions', 																// последние 15-ать версий браузеров
// 		'> 1%', 																						// для IE
// 		'ie 8', 																						// поддержка IE8
// 		'ie 7' 																							// поддержка IE7
// 	], 
// 		{ cascade: true }))																	// Формаирование кода
// 	.pipe(postcss([
// 		mqpacker({sort: true})															// Сортировка медиа-выражений
// 	]))
// 	.pipe(gulp.dest('src/css'))														// Директория сохранения, название файла будет как у sass
// 	.pipe(browserSync.reload({stream: true}));						// Для перезагрузки сервера browser-sync при изменении
// });



// WATCH-SASS (если пользуемся sass) 

// gulp.task('watch-sass', ['browser-sync', 'sass'], function() {		// Команда в консоли |gulp watch-sass|, ['browser-sync и sass'] запустится до watch
// 	gulp.watch('src/sass/**/*.sass', ['sass']);											// Какие файлы вотчить и какой ['sass'] при этом выполнять
// 	gulp.watch('src/**/*.html', browserSync.reload);								// Вотчим html-файлы и перезагружаем browserSync при редактировании html
// 	gulp.watch('src/js/**/*.js', browserSync.reload);								// Вотчим js-файлы и перезагружаем browserSync при редактировании js
// });