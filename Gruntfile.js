module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    


    // Compile
    clean: ['dist'],

    'dart-sass': {
      flatcal: {
        options: {
          sourceMap: true,
          outFile: 'dist/assets/css',
          outputStyle: 'compressed'
        },
        files: [{
          expand: true,
          cwd: 'src/assets/sass',
          src: ['*.scss'],
          dest: 'dist/assets/css',
          ext: '.css'
        }]
      }
    },

    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'src',
          src: [
            '**',
            '!assets/sass/**',
            '!assets/js/**'
          ],
          dest: 'dist'
        }]
      }
    },

    uglify: {
      main: {
        options: {
          sourceMap: true
        },
        files: [{
          expand: true,
          cwd: 'src/assets/js',
          src: '*.js',
          dest: 'dist/assets/js'
        }]
      }
    },


    watch: {
      main: {
        files: ['src/**/*'],
        tasks: ['build'],
        options: {
          spawn: false
        }
      }
    },

    notify_hooks: {
      errors: {
        options: {
          title: 'MB Problems',
          success: false,
          duration: 5
        }
      }
    },



    // Packaging
    compress: {
      main: {
        options: {
          archive: 'dist.zip'
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: [
            '**/*',
            '!**/*.map'
          ],
          dest: '/'
        }]
      }
    },


    // Testing
    eslint: {
      options: {
        configFile: '.eslintrc.json'
      },
      target: ['src/assets/js/**/*.js']
    },

    sasslint: {
      target: ['src/assets/sass/**/*.scss']
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-dart-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-sass-lint');


  // Default task(s).
  grunt.registerTask('default', ['notify_hooks:errors', 'build', 'watch']);
  grunt.registerTask('build', ['clean', 'copy', 'dart-sass', 'uglify']);
  grunt.registerTask('lint', ['eslint', 'sasslint']);
  grunt.registerTask('package', ['build', 'compress']);

};