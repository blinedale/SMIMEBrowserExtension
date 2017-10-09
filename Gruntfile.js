'use strict';

module.exports = function(grunt) {

  const pkg = grunt.file.readJSON('package.json');
  const webpackConfig = require('./webpack.config');

  grunt.initConfig({

    clean: ['build/**/*'],

    copy: {
      chrome: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: [
            'chrome/manifest.json'
          ],
          dest: 'build/'
        }]
      },

      common: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: [
            'content-scripts/*.css',
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
        files: ['Gruntfile.js', 'src/**/*'],
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
      dev: Object.assign({ watch: true }, webpackConfig)
    }

  });

  // load grunt packages
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // development build
  grunt.registerTask('default', ['clean', 'copy:chrome', 'copy:common', 'webpack:prod', 'copy:tmp2chrome']);
};