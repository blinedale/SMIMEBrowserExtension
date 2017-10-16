module.exports = function(grunt) {
  const webpackConfig = require('./webpack.config');

  grunt.initConfig({

    clean: ['build/**/*'],

    eslint: {
      options: {
        maxWarnings: 10,
        configFile: 'eslint.json',
        cache: true
      },
      target: [
        '*.js',
        'src/**/*.js',
        'test/**/*.js',
        '!src/lib/*',
        '!src/chrome/background.js'
      ]
    },

    copy: {
      chrome: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: [
            'chrome/*'
          ],
          dest: 'build/'
        }]
      },

      config: {
        files: [{
          expand: true,
          cwd: 'config/',
          src: [
            'config.json'
          ],
          dest: 'build/tmp/'
        }]
      },

      common: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: [
            'content-scripts/*.css',
            'lib/*',
            'css/*',
            'img/*'
          ],
          dest: 'build/tmp'
        }]
      },

      tmp2chrome: {
        files: [{
          expand: true,
          cwd: 'build/tmp/',
          src: '**/*',
          dest: 'build/chrome'
        }]
      }
    },

    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*', 'config/**'],
        tasks: ['default'],
        options: {
          spawn: false
        }
      }
    },

    webpack: {
      options: {
        stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      },
      prod: webpackConfig,
      dev: Object.assign({watch: true}, webpackConfig)
    }

  });

  // load grunt packages
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');

  // development build
  grunt.registerTask('default', ['clean', 'eslint', 'copy:chrome', 'copy:config', 'copy:common', 'webpack:prod', 'copy:tmp2chrome']);
};
