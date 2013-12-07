/*
 * grunt-asset-render
 * https://github.com/kagia/grunt-asset-render
 *
 * Copyright (c) 2013 Benjamin Kagia
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    asset_render: {

      // the rendered template is dumped to the destination
      render_to_file: {
        options: {
          template: 'test/fixtures/list_assets.handlebars'
        },

        files: {
          'tmp/no_asset.html': 'will_not_match.any',
          'tmp/all_assets.html': 'test/fixtures/assets/**/*',
          'tmp/some_assets.html': [
                                  'test/fixtures/assets/test.css',
                                  'test/fixtures/assets/test.js',
                                  'test/fixtures/assets/test/*.html',
                                  '!test/fixtures/test/test/testing2.html'
                                  ],
        }
      },

      // the template is merged into an existing file
      inject_to_file: {
        options: {
          template: 'test/fixtures/list_assets.handlebars',
          inject: true
        },

        files: {
          'test/fixtures/no_asset_injection.html': 'will_not_match.any',

          'test/fixtures/some_assets_injection.html': [
                                  'test/fixtures/assets/test.css',
                                  'test/fixtures/assets/test.js',
                                  'test/fixtures/assets/test/*.html',
                                  '!test/fixtures/test/test/testing2.html'
                                  ],
        }
      },

      // tags other than the default are used as injection targets
      custom_tag_injection: {
        options: {
          template: 'test/fixtures/list_assets.handlebars',
          inject: true,
          start_word: 'INJECT HERE',
          end_word: 'STOP',
          delimiters: '## ##'
        },

        files: {
          'test/fixtures/custom_delimiters_injection.html': [
                                  'test/fixtures/assets/test.css',
                                  'test/fixtures/assets/test.js',
                                  'test/fixtures/assets/test/*.html',
                                  '!test/fixtures/test/test/testing2.html'
                                  ],
        }
      },

      // if the opening and closing tags share the same line so should a single line injection
      inline_injection: {
        options: {
          template: 'test/fixtures/comma_separated_assets.handlebars',
          inject: true
        },

        files: {
          'test/fixtures/inline_injection.html': [
                                  'test/fixtures/assets/test.css',
                                  'test/fixtures/assets/test.js',
                                  'test/fixtures/assets/test/*.html',
                                  '!test/fixtures/test/test/testing2.html'
                                  ],
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'asset_render', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
