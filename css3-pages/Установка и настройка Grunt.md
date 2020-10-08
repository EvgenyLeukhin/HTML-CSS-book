НАСТРОЙКА и УСТАНОВКА Grunt 													(http://gruntjs.com/)
************************************************************************************************
1.  Cтавим node.js 																		(https://nodejs.org/en/);
1.1 Проверяем: 																				node -v, npm -v;
1.2 Инициализируем проект: 														npm init;
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


НАСТРОЙКА Gruntfile.js
************************************************************************************************
// 1. Gruntfile.js настраивается всегда как функция объекта
module.exports = function(grunt) {
// 2. Подгружаем  установленные плагины
	grunt.loadNpmTasks('grunt-less');						// Подгружаем плагин less
	grunt.loadNpmTasks('grunt-sass');						// Подгружаем плагины sass
// 3. Настраиваем плагины:
	grunt.initConfig({

		less: {																		// Будет работать по команде: grunt less
			style: {
				files: {
					'css/style.css': 'less/style.less' 	// Директории конечная: исходная
				}
			}
		},
		
		cssmin: {																	// Будет работать по команде: | grunt cssmin |
  		options: {
    		shorthandCompacting: false,
    		roundingPrecision: -1
  		},
  		target: {
    		files: {
    			// 'Директория для минифицированного файла' : ['Файлы, которые нужно объединить и минифицировать']
      		'src/css/all.min.css': ['src/css/normalize.css', 'src/css/style.css']
    		}
  		}
		}
	});
};