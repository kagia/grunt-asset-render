/*
 * grunt-asset-render
 * https://github.com/kagia/grunt-asset-render
 *
 * Copyright (c) 2013 Benjamin Kagia
 * Licensed under the MIT license.
 */

'use strict';

function mergeHashes () {
    var args = Array.prototype.slice.call(arguments);
    var output = {};
    args.map(function(hash) {
        for (var property in hash) {
            if (hash.hasOwnProperty(property)) {
                output[property] = hash[property];
            }
        }
    });
    return output;
}

module.exports = function(grunt) {

  var os = require('os');
  var hogan = require('hogan.js');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('asset_render', 'injects assets into templates', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      delimiters: '<!-- -->',
      inject: false,
      start_word: 'START',
      end_word: 'END',
      promotions: []
    });

    var data = this.data;
    // Iterate over all specified file groups.
    this.files.forEach(function(filePair) {
      grunt.log.writeln("Prepairing files for " + filePair.dest);
      var files = filePair.src;

      // format source filepaths.
      if (filePair.src.length === 0) {
        grunt.log.writeln("    no input files found, skipping...");
        return;
      }

      if (options.promotions.length > 0) {
        var globSort = require('../lib/glob-sort');
        files = globSort(files, options.promotions);
      }

      var template = grunt.file.read(options.template);
      
      template = hogan.compile(template);

      files = files.map(function(filepath) {
        grunt.log.writeln('    found : ' + filepath);
        return {'file':filepath};
      });

      var output = template.render({'files':files});
      output = output.replace(/(?:\n|\r\n)+\s*$/, '');

      if (options.inject) {
        var inject = require('../lib/inject.js');
        var injectionOptions = {
          start_token: options.start_word,
          end_token: options.end_word,
          delimiters: options.delimiters,
          error_context: filePair.dest
        };
        var input = grunt.file.read(filePair.dest);
        output = inject(input, output, injectionOptions);
        if (output === undefined) {
          grunt.warn("No files updated, check destination file.");
        }
      }

      grunt.file.write(filePair.dest, output);
      grunt.log.writeln('File "' + filePair.dest + '" updated.');
      
    });
  });

};