/*jshint node:true*/

'use strict';

module.exports = function(grunt) {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks listed in package.json automatically
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // shell commands for use in Grunt tasks
    shell: {
      jekyllBuild: {
        command: 'bundle exec jekyll build'
      },
      jekyllServe: {
        command: "bundle exec jekyll serve --baseurl ''"
      },
      jekyllBuildProd: {
        command: "bundle exec jekyll build --config _config-prod.yml"
      }
    },
    sass: {
      dist: {
        options: {
          sourceMap: true,
          relativeAssets: false,
          outputStyle: 'expanded',
          sassDir: '_scss',
          cssDir: 'css',
          includePaths: [
            'library/library/assets/_scss/',
            'library/_scss/',
            '_scss/'
          ],
        },
        files: [
          {
            src: 'library/css/usajobs-design-system-base--help-center.css',
            dest: 'css/usajobs-design-system-base--help-center.css'
          },
          {
            src: '_scss/help-center.scss',
            dest: 'css/help-center.css'
          },
          {
            expand: true,
            cwd: '_scss/layouts/',
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
          'library/css/usajobs-design-system-base--help-center.css',
          'css/help-center.css'
        ],
        dest: 'css/usajobs-help-center.min.css'
      }
    },
    concat: {
      all: {
        src: [
          'library/js/vendor/modernizr.js',
          'js/vendor/search.min.js',
          'library/js/vendor/jquery.ba-throttle-debounce.min.js',
          'library/js/vendor/jquery-ui.min.js',
          'library/js/base.js',
          'library/js/components/usds-components.js',
          'library/js/components/footer.js',
          'library/js/components/nav.js',
          'js/components/*.js'
        ],
        dest: 'js/usajobs-help-center.js'
      }
    },
    jshint: {
      jshintrc: true,
      all: [
        'Gruntfile.js',
        'js/components/*.js',
        '!js/vendor/*.js',
        '!js/usajobs-help-center.js'
      ],
      components: [
        'js/components/*.js'
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
          '_scss/**/*.scss'
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
        tasks: ['jshint:all', 'concat:all'],
        options: {
          debounceDelay: 250,
          livereload: true
        }
      },
      components: {
        files: [
          'js/components/*.js'
        ],
        tasks: ['jshint:components', 'concat:all'],
        options: {
          debounceDelay: 250,
          livereload: true
        }
      }
    },
    // run tasks in parallel
    concurrent: {
      serve: [
        'sass',
        'css',
        'watch',
        'shell:jekyllServe'
      ],
      options: {
        logConcurrentOutput: true
      }
    },
    linkChecker: {
      // Use a large amount of concurrency to speed up check
      options: {
        maxConcurrency: 20,
        noFragment: true
      },
      dev: {
        site: 'localhost',
        options: {
          initialPort: 4001
        }
      },
      postDeploy: {
        site: 'usajobs.github.io/help-center/'
      }
    }
  });

  grunt.registerTask('serve', ['concurrent:serve']);
  grunt.registerTask('build', ['shell:jekyllBuild', 'css', 'js']);
  grunt.registerTask('build-flat', ['shell:jekyllBuildFlat']);
  grunt.registerTask('build-prod', ['shell:jekyllBuildProd']);
  grunt.registerTask('css', ['sass', 'autoprefixer', 'cssmin']);
  grunt.registerTask('js', ['jshint:all', 'concat']);
};
