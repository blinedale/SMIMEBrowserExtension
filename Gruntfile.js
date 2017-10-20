module.exports = function(grunt) {
  const webpackConfig = require('./webpack.config');
  const pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({

    clean: ['build/**/*', 'dist/*'],

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
        '!src/lib/*'
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

      firefox: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: [
            'firefox/*'
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
            'components/*',
            'css/*',
            'img/*',
            'lib/*'
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
      },

      tmp2firefox: {
        files: [{
          expand: true,
          cwd: 'build/tmp/',
          src: '**/*',
          dest: 'build/firefox'
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
      firefox: {
        options: {
          mode: 'zip',
          archive: 'dist/RocketSMIMEBrowserExtension.firefox.zip',
          pretty: true
        },
        files: [{
          expand: true,
          cwd: 'build/',
          src: ['firefox/**/*', 'firefox/!**/.*']
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
          }, {
            match: 'description_text',
            replacement: pkg.description
          }, {
            match: 'name_text',
            replacement: pkg.name_text
          }, {
            match: 'homepage_text',
            replacement: pkg.homepage
          }, {
            match: 'short_name_text',
            replacement: pkg.short_name_text
          }]
        }
      },

      version_firefox: {
        src: 'build/firefox/manifest.json',
        dest: 'build/firefox/manifest.json',
        options: {
          patterns: [{
            match: 'build_version',
            replacement: pkg.version
          }, {
            match: 'description_text',
            replacement: pkg.description
          }, {
            match: 'name_text',
            replacement: pkg.name_text
          }, {
            match: 'homepage_text',
            replacement: pkg.homepage
          }, {
            match: 'short_name_text',
            replacement: pkg.short_name_text
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
      build: webpackConfig,
      watch: Object.assign({watch: true}, webpackConfig)
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
  grunt.registerTask('default', ['clean', 'eslint', 'copy:chrome', 'copy:firefox', 'copy:config', 'copy:common', 'webpack:build', 'copy:tmp2chrome', 'copy:tmp2firefox', 'replace:version_chrome', 'replace:version_firefox', 'compress:chrome', 'compress:firefox']);

  // production build - should be same as above except we run replace:debugMode_off in the middle
  grunt.registerTask('prod', ['clean', 'eslint', 'copy:chrome', 'copy:firefox', 'copy:config', 'copy:common', 'webpack:build', 'replace:debugMode_off', 'copy:tmp2chrome', 'copy:tmp2firefox', 'replace:version_chrome', 'replace:version_firefox', 'compress:chrome', 'compress:firefox']);
};
