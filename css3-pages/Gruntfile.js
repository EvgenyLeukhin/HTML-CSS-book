module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            options: {
                paths: ['Less/']
            },
            files: {
                expand: true,
                cwd:    "less/",
                dest:   "css/",
                src:    "*.less",
                ext:    ".css"
            }
        },

        autoprefixer:{
            options: {
                browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
                cascade: false
            },
            multiple_files: {
                expand: true,
                flatten: true,
                src: 'css/*.css',
                dest: 'css/'
            }
        },

        watch: {
            scripts: {
                files: ['Less/*.less'],
                tasks: ['newer:less', 'autoprefixer'],
                options: {
                    spawn: false
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-newer');
    grunt.registerTask('default', ['less', 'autoprefixer', 'watch']);

};