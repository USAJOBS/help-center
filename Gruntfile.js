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
      },
      spellCheck: {
        command: "mdspell -r -n -a --en-us faq/**/*.md how-to/**/*.md working-in-government/**/*.md"
      },
      linkChecker: {
        command: "blc http://usajobs.github.io/Help/ -e -r"
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
            'node_modules/bourbon/app/assets/stylesheets/',
            'node_modules/bourbon-neat/app/assets/stylesheets/',
            'node_modules/uswds/src/stylesheets/',
            'node_modules/uswds/src/stylesheets/lib/',
            'node_modules/usajobs-design-system/node_modules/bourbon/app/assets/stylesheets/',
            'node_modules/usajobs-design-system/node_modules/bourbon-neat/app/assets/stylesheets/',
            'node_modules/usajobs-design-system/node_modules/uswds/src/stylesheets/',
            'node_modules/usajobs-design-system/node_modules/uswds/src/stylesheets/lib/',
            'node_modules/usajobs-design-system/_scss/',
            '_scss/'
          ],
        },
        files: [
          {
            src: 'node_modules/usajobs-design-system/css/usajobs-design-system-base--help-center.css',
            dest: 'css/usajobs-design-system-base--help-center.css'
          },
          {
            src: '_scss/help-center.scss',
            dest: 'css/help-center.css'
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
          'css/usajobs-design-system-base--help-center.css',
          'css/help-center.css'
        ],
        dest: 'css/usajobs-help-center.min.css'
      }
    },
    browserify: {
      dist: {
        src: [ 'js/glossary.js'],
        dest: 'js/vendor/glossary.js'
      }
    },
    concat: {
      base: {
        src: [
          'node_modules/usajobs-design-system/js/usajobs-design-system-base.js',
          'node_modules/usajobs-design-system/js/components/footer.js',
          'node_modules/usajobs-design-system/js/components/modal.js',
          'node_modules/usajobs-design-system/js/components/nav.js'
        ],
        dest: 'js/usajobs-help-center-base.js'
      },
      components: {
        src: [
          'node_modules/scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
          'js/vendor/picturefill.min.js',
          'js/vendor/search.min.js',
          'js/vendor/glossary.js',
          'js/components/*.js'
        ],
        dest: 'js/usajobs-help-center-components.js'
      },
      prod: {
        src: [
          'js/usajobs-help-center-base.js',
          'js/usajobs-help-center-components.js'
        ],
        dest: 'js/usajobs-help-center.js'
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      prod: {
        files: {
          'js/usajobs-help-center.min.js': ['js/usajobs-help-center.js']
        }
      }
    },
    jshint: {
      jshintrc: true,
      all: [
        'Gruntfile.js',
        'js/glossary.js',
        'js/components/*.js',
        '!js/vendor/*.js',
        '!js/usajobs-help-center.js',
        '!js/usajobs-help-center-components.js'
      ],
      components: [
        'js/glossary.js',
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
          'js/terms.json',
          '!js/vendor/*.js',
          '!js/usajobs-help-center.js',
          '!js/usajobs-design-system-base.js',
          '!js/usajobs-design-system-components.js',
          '!js/usajobs-design-system-documentation.js'
        ],
        tasks: ['jshint:all', 'concat:base'],
        options: {
          debounceDelay: 250,
          livereload: true
        }
      },
      components: {
        files: [
          'js/components/*.js'
        ],
        tasks: ['jshint:components', 'concat:components'],
        options: {
          debounceDelay: 250,
          livereload: true
        }
      }
    },
    // run tasks in parallel
    concurrent: {
      serve: [
        'css',
        'watch',
        'shell:jekyllServe'
      ],
      options: {
        logConcurrentOutput: true
      }
    },
    htmllint: {
      all: {
        options: {
          errorlevels: ['error'],
          ignore: [
            'Element “img” is missing required attribute “src”.',
            'Attribute “aria-labeledby” not allowed on element “ul” at this point.'
          ]
        },
        src: [ '_dist/**/*.html' ]
      }
    }
  });

  grunt.registerTask('serve', ['concurrent:serve']);
  grunt.registerTask('build', ['shell:jekyllBuild', 'css', 'js']);
  grunt.registerTask('build-flat', ['shell:jekyllBuildFlat']);
  grunt.registerTask('build-prod', ['shell:jekyllBuildProd']);
  grunt.registerTask('css', ['sass', 'autoprefixer', 'cssmin']);
  grunt.registerTask('js', ['jshint:all', 'concat:base', 'browserify', 'concat:components', 'concat:prod', 'uglify:prod']);
  grunt.registerTask('test', ['shell:spellCheck', 'htmllint', 'shell:linkChecker']);
};
