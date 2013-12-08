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

exports.inject_tests = {
  setUp: function(done) {
    this.inject = require('../lib/inject');
    done();
  },

  missing_start_tag_throws: function(test) {
    test.expect(1);

    var input = "bla bla <!-- END --> bla";
    var template = "test";

    test.throws(function() {this.inject(input, template, {});}, Error, "do not allow missing start tags");

    test.done();
  },

  missing_end_tag_throws: function(test) {
    test.expect(1);

    var input = "bla bla <!-- START --> bla";
    var template = "test";

    test.throws(function() {this.inject(input, template, {});}, Error, "do not allow missing start tags");

    test.done();
  },

  no_tag_no_injection: function(test) {
    test.expect(1);

    var input = "bla bla bla";
    var template = "test";

    test.equals(this.inject(input, template, {}), undefined, "when tags are not found return nothing");

    test.done();
  },

  multiline_injection: function(test) {
    test.expect(2);

    var input = "bla bla <!-- START --> \n <!-- END --> bla";
    var template = "test";

    var output = this.inject(input, template, {});

    var lines = output.split(/\n|\r\n/);
    test.equals(lines.length, 3, "template should be verticaly stacked between multiline tags");

    var indentation = input.indexOf('<!-- START -->');
    var test_line = lines[1];
    test.equals(test_line.indexOf('test'), indentation, "template should be indented to the level of the start tag");

    test.done();
  },

  inline_injection: function(test) {
    test.expect(1);

    var input = "bla bla <!-- START --> <!-- END --> bla";
    var template = "test";

    var output = this.inject(input, template, {});
    var lines = output.split(/\n|\r\n/);

    test.equals(lines.length, 1, "one line template should be horizontaly sandwiched between inline tags");

    test.done();
  }
};
