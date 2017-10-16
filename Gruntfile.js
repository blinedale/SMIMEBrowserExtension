module.exports = function(grunt) {
  const webpackConfig = require('./webpack.config');
  const pkg = grunt.file.readJSON('package.json');

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

    compress: {
      chrome: {
        options: {
          mode: 'zip',
          archive: 'dist/RocketSMIMEBrowserExtension.chrome.zip',
          pretty: true
        },
        files: [{
          expand: true,
          cwd: 'build/',
          src: ['chrome/**/*', 'chrome/!**/.*']
        }]
      },
    },

    replace: {
      debugMode_off: {
        src: 'build/tmp/config.json',
        dest: 'build/tmp/config.json',
        options: {
          patterns: [{
            match: /"debugMode": true/g,
            replacement: '"debugMode": false',
          }]
        }
      },
      version_chrome: {
        src: 'build/chrome/manifest.json',
        dest: 'build/chrome/manifest.json',
        options: {
          patterns: [{
            match: 'build_version',
            replacement: pkg.version
          }]
        }
      },
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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-webpack');

  // development build
  grunt.registerTask('default', ['clean', 'eslint', 'copy:chrome', 'copy:config', 'copy:common', 'webpack:prod', 'copy:tmp2chrome', 'replace:version_chrome']);

  // production build
  grunt.registerTask('prod', ['clean', 'eslint', 'copy:chrome', 'copy:config', 'copy:common', 'webpack:prod', 'replace:debugMode_off', 'copy:tmp2chrome', 'replace:version_chrome', 'compress:chrome']);
};
