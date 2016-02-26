/*jshint node:true*/

'use strict';

module.exports = function(grunt) {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks listed in package.json automatically
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          sourceMap: true,
          relativeAssets: false,
          outputStyle: 'expanded',
          sassDir: 'scss',
          cssDir: 'css',
          includePaths: [
            'library/library/assets/_scss/',
            'library/_scss/',
            'scss/'
          ],
        },
        files: [
          {
            src: 'scss/help-center.scss',
            dest: 'css/usajobs-help-center.css'
          },
          {
            expand: true,
            cwd: 'scss/layouts/',
            src: '*.scss',
            dest: 'css/layouts/',
            ext: '.css'
          }
        ]
      }
    },
    autoprefixer: {
      options: {
        map: true, // Use and update the sourcemap
        browsers: ["last 3 versions", "> 2% in US"]
      },
      project_css: {
        expand: true,
        flatten: true,
        src: 'css/*.css',
        dest: 'css/'
      },
      layouts_css: {
        expand: true,
        flatten: true,
        src: 'css/layouts/*.css',
        dest: 'css/layouts/'
      }
    },
    cssmin: {
      minify: {
        src: [
          'css/usajobs-design-system-base.css',
          'css/usajobs-design-system-components.css',
          'css/layouts/*.css'
        ],
        dest: 'css/usajobs-design-system.min.css'
      }
    },
    jshint: {
      jshintrc: true,
      all: [
        'Gruntfile.js',
        'js/**/*.js',
        '!js/vendor/*.js',
        '!js/usajobs-design-system-base.js',
        '!js/usajobs-design-system-components.js'
      ],
      gruntfile: 'Gruntfile.js'
    },
    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5, // maximum number of notifications from jshint output
        success: false // whether successful grunt executions should be notified automatically
      }
    },
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },
      sass: {
        files: [
          'scss/**/*.scss'
        ],
        tasks: ['sass'],
        options: {
          livereload: true
        }
      },
      base: {
        files: [
          'js/*.js',
          '!js/vendor/*.js',
          '!js/usajobs-design-system-base.js',
          '!js/usajobs-design-system-components.js',
          '!js/usajobs-design-system-documentation.js'
        ],
        tasks: ['jshint:all', 'concat'],
        options: {
          debounceDelay: 250,
          livereload: true
        }
      }
    },
    banana: {
      all: 'i18n/'
    },
    jsonlint: {
      all: [
        '**/*.json',
        '!node_modules/**'
      ]
    },
    // run tasks in parallel
    concurrent: {
      serve: [
        'sass',
        'watch'
      ],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  grunt.registerTask('default', ['css', 'watch']);
  grunt.registerTask('build', ['jsonlint', 'css']);
  grunt.registerTask('css', ['sass', 'autoprefixer', 'cssmin']);
};
