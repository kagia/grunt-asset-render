'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.asset_render = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  render_to_file: function(test) {
    test.expect(3);
    test.equal(grunt.file.exists('tmp/no_asset.html'), false, 'no template should be generated');

    var actual = grunt.file.read('tmp/all_assets.html');
    var expected = grunt.file.read('test/expected/all_assets.html');
    test.equal(actual, expected, 'the template should contain all assets');

    actual = grunt.file.read('tmp/some_assets.html');
    expected = grunt.file.read('test/expected/some_assets.html');
    test.equal(actual, expected, 'the template should contain some assets');

    test.done();
  },

  inject_to_file: function(test) {
    test.expect(2);

    var actual = grunt.file.read('test/fixtures/no_asset_injection.html');
    var expected = grunt.file.read('test/expected/no_asset_injection.html');
    test.equal(actual, expected, 'The file should contain no assets');

    actual = grunt.file.read('test/fixtures/some_assets_injection.html');
    expected = grunt.file.read('test/expected/some_assets_injection.html');
    test.equal(actual, expected, 'The file should contain some assets');

    test.done();
  },

  custom_tag_injection: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/fixtures/custom_delimiters_injection.html');
    var expected = grunt.file.read('test/expected/custom_delimiters_injection.html');
    test.equal(actual, expected, 'the file should contain some assets');

    test.done();
  },

  inline_injection: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/fixtures/inline_injection.html');
    var expected = grunt.file.read('test/expected/inline_injection.html');
    test.equal(actual, expected, 'the file should contain a single line');

    test.done();
  },

};
