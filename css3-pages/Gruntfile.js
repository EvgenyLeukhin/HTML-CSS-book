// 1. Gruntfile.js настраивается всегда как функция объекта
module.exports = function(grunt) {

// 2. Подгружаем  установленные плагины (название плагинов такое же, как при установке через консоль, буква в букву)
	grunt.loadNpmTasks('grunt-contrib-watch');					// Подгружаем плагин watch +
	grunt.loadNpmTasks('grunt-newer');									// Подгружаем плагин newer (чего-то не работает, в будущем не ставить) 
	grunt.loadNpmTasks('grunt-browser-sync');						// Подгружаем плагин browser-sync +
	grunt.loadNpmTasks('grunt-contrib-less');						// Подгружаем плагин less +
	grunt.loadNpmTasks('grunt-autoprefixer');						// Подгружаем плагин autoprefixer + 
	grunt.loadNpmTasks('grunt-contrib-cssmin');					// Подгружаем плагин cssmin +
	grunt.loadNpmTasks('grunt-contrib-concat');					// Подгружаем плагин concat + 
	grunt.loadNpmTasks('grunt-contrib-uglify');					// Подгружаем плагин uglify +
	grunt.loadNpmTasks('grunt-contrib-imagemin');				// Подгружаем плагин imagemin +
	grunt.loadNpmTasks('grunt-contrib-csslint');				// Подгружаем плагин csslint + (в будущем не ставить)

// 3. Дефолтные настройки:
									 // название    Список тасков по команде | grunt | 
	grunt.registerTask('default', ['less', 'autoprefixer', 'browserSync', 'watch']);

// 3.1 Кастомный таск (можно создать самому)
	grunt.registerTask('custom', function() {
		console.log('***************** Можно создать собственный таск таким образом *****************');
	});

// 4. Настраиваем плагины: 
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'), 					// Говорим Grunt, чтобы он читал список завсимостей

		// WATCH*
		watch: {																						// Будет работать по команде: | grunt watch |
			options: {
				livereload: true
			},
			scripts: {
				files: ['src/less/**/*.less'],
				tasks: ['less']
			}
		},


		// LESS*
		less: {																						// Будет работать по команде: | grunt less |
			development: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files: {
					'src/css/style.css': 'src/less/main.less' 	// Директории конечная: исходная
				}
			}
		},


		// BROWSER SYNC*
		browserSync: {																		// Будет работать по команде: | grunt browserSync |
			dev: {
				bsFiles: {
					src : [
							'src/css/*.css',
							'src/*.html'
					]
				},
				options: {
					watchTask: true,
					server: './src'
				}
			}
		},


		// CSS-AUTOPREFIXER*
		autoprefixer: {																			// Будет работать по команде: | grunt autoprefixer |
    	options: {
      	browsers: ['opera 12', 'ff 15', 'chrome 25']		// Настройки для браузеров
    	},
			single_file: {
      	src: 'src/css/style.css',												// Исходник
      	dest: 'src/css/style.css'												// Туда же перезапишется
			}
		},


		// CSS-MIN-CONCAT
		cssmin: {																						// Будет работать по команде: | grunt cssmin |
  		options: {
    		shorthandCompacting: false,
    		roundingPrecision: -1
  		},
  		target: {
    		files: {
    // 'Директория для минифицированного файла' : ['Файлы, которые нужно объединить и минифицировать']
      		'src/css/all.min.css': ['src/css/**/*.css']
    		}
  		}
		},


		// JS-CONCAT
		concat: {																						// Будет работать по команде: | grunt concat | 
    	options: {
      	separator: ';',																	// Разделитель между скриптами
    	},
    	dist: { // Использовать осторожно, не перезаписывает файл, а добавляет к нему, может есть настройки ???
      	src: ['src/js/*.js'],												// Исходники
      	dest: 'src/js/all.js',													// Конечный файл
    	}
  	},


		// JS-MIN
  	uglify: {																						// Будет работать по команде: | grunt uglify |
  		dist: {
    		options: {banner: '/*Created by Grunt uglify*/\n'},			 // Комментарий перед мин. кодом
    		files: {																				// Какой файл минифицировать и куда сохр.
					'src/js/all.min.js': ['src/js/all.js']
    		}
  		}
		},


		// IMAGE-MIN
		imagemin: {																					// Будет работать по команде: | grunt imagemin |
    	dynamic: {
        files: [{
        	expand: true,
        	cwd: 'src/',																	// Где искать исходники
        	src: ['**/*.{png,jpg,gif}'],									// Форматы изображений
        	dest: 'src/img_min'														// Куда складывать
        }]
			}
		},


		// CSS-LINT			!!! НЕ ПОНРАВИЛСЯ (выдаёт ошибки там, где их нет) !!!
		csslint: {																					// Будет работать по команде: | grunt csslint |
  		strict: {
    		options: { import: 2 },
    		src: ['src/css/style.css']
  		}
		}


	});


};




/*
НАСТРОЙКА и УСТАНОВКА Grunt 													(http://gruntjs.com/)
************************************************************************************************
1.  Cтавим node.js 																		(https://nodejs.org/en/);
1.1 Проверяем: 																				node -v, npm -v;
1.2 Инициализируем проект: 														npm init (package.json)
1.3 Возможно придётся выполнить команду 							npm install
2.  Устанавливаем Grunt в директорию с проектом:			npm -i grunt grunt-cli -g(или --save-dev);
3.	Устанавливаем плагины:																						 npm i --save-dev 
			преобразование less в css																					 grunt-contrib-less
			минификатор\конкатинатор css																			 grunt-contrib-cssmin
			вотчинг редактирования																						 grunt-contrib-watch
			авто-префиксы в css																								 grunt-autoprefixer
			преобразование sass в css																					 grunt-contrib-sass
			преобразование coffee в js																				 grunt-contrib-coffee
			редактировать только измененные файлы (а не все)									 grunt-newer
			конкатинатор js																										 grunt-contrib-concat
			минификатор js																										 grunt-contrib-uglify

4.	Создаём в дирктории 																							 Gruntfile.js;
			
			grunt-browser-sync — вероятно, самый нужный инструмент

*/