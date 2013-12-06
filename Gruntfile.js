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

    // Configuration to be run (and then tested).
    asset_render: {
      default_options: {
        options: {
          template: 'test/fixtures/default.handlebars'
        },
        files: {
          'tmp/default_options.html': ['test/fixtures/testing', 'test/fixtures/123'],
        },
      },

      custom_options: {
        options: {
          template: 'test/fixtures/custom.handlebars',
          delimiters: '!... ...'
        },

        files: {
          'tmp/custom_options.html': ['test/fixtures/testing', 'test/fixtures/123'],
        },
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
