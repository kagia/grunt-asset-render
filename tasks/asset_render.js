/*
 * grunt-asset-render
 * https://github.com/kagia/grunt-asset-render
 *
 * Copyright (c) 2013 Benjamin Kagia
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var os = require('os');
  var hogan = require('hogan.js');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('asset_render', 'injects assets into templates', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      delimiters: '{{ }}',
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(filePair) {
      var urls = [];

      // format source filepaths.
      var src = filePair.src.map(function(filepath) {
        var url = filepath;
        if (os.platform() === 'win32') {
          // correct path separator
          url = url.replace(/\\/g, '/');
        }
        grunt.log.writeln('adding url: ' + url);
        urls.push({'url':filepath});
      });

      var template = grunt.file.read(options.template);
      
      template = hogan.compile(template, {delimiters: options.delimiters});

      var output = template.render({'urls':urls});

      grunt.file.write(filePair.dest, output);

      // Print a success message.
      grunt.log.writeln('File "' + filePair.dest + '" updated.');
    });
  });

};
